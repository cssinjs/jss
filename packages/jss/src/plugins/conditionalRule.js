import RuleList from '../RuleList'
import getWhitespaceSymbols from '../utils/getWhitespaceSymbols'

const defaultToStringOptions = {
  indent: 1,
  children: true
}

const atRegExp = /@([\w-]+)/

/**
 * Conditional rule for @media, @supports
 */
export class ConditionalRule {
  type = 'conditional'

  isProcessed = false

  constructor(key, styles, options) {
    this.key = key
    const atMatch = key.match(atRegExp)
    this.at = atMatch ? atMatch[1] : 'unknown'
    // Key might contain a unique suffix in case the `name` passed by user was duplicate.
    this.query = options.name || `@${this.at}`
    this.options = options
    this.rules = new RuleList({...options, parent: this})

    for (const name in styles) {
      this.rules.add(name, styles[name])
    }

    this.rules.process()
  }

  /**
   * Get a rule.
   */
  getRule(name) {
    return this.rules.get(name)
  }

  /**
   * Get index of a rule.
   */
  indexOf(rule) {
    return this.rules.indexOf(rule)
  }

  /**
   * Create and register rule, run plugins.
   */
  addRule(name, style, options) {
    const rule = this.rules.add(name, style, options)
    if (!rule) return null
    this.options.jss.plugins.onProcessRule(rule)
    return rule
  }

  /**
   * Replace rule, run plugins.
   */
  replaceRule(name, style, options) {
    const newRule = this.rules.replace(name, style, options)
    if (newRule) this.options.jss.plugins.onProcessRule(newRule)
    return newRule
  }

  /**
   * Generates a CSS string.
   */
  toString(options = defaultToStringOptions) {
    const {linebreak} = getWhitespaceSymbols(options)
    if (options.indent == null) options.indent = defaultToStringOptions.indent
    if (options.children == null) options.children = defaultToStringOptions.children
    if (options.children === false) {
      return `${this.query} {}`
    }
    const children = this.rules.toString(options)
    return children ? `${this.query} {${linebreak}${children}${linebreak}}` : ''
  }
}

const keyRegExp = /@media|@supports\s+/

export default {
  onCreateRule(key, styles, options) {
    return keyRegExp.test(key) ? new ConditionalRule(key, styles, options) : null
  }
}
