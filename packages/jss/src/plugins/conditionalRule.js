/* @flow */
import RuleList from '../RuleList'
import type {CSSMediaRule, Rule, RuleOptions, ToCssOptions, JssStyle, ContainerRule} from '../types'

const defaultToStringOptions = {
  indent: 1,
  children: true
}

const atRegExp = /@([\w-]+)/

/**
 * Conditional rule for @media, @supports
 */
export class ConditionalRule implements ContainerRule {
  type = 'conditional'

  at: string

  key: string

  rules: RuleList

  options: RuleOptions

  isProcessed: boolean = false

  renderable: ?CSSMediaRule

  constructor(key: string, styles: Object, options: RuleOptions) {
    this.key = key
    const atMatch = key.match(atRegExp)
    this.at = atMatch ? atMatch[1] : 'unknown'
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
  getRule(name: string): Rule {
    return this.rules.get(name)
  }

  /**
   * Get index of a rule.
   */
  indexOf(rule: Rule): number {
    return this.rules.indexOf(rule)
  }

  /**
   * Create and register rule, run plugins.
   */
  addRule(name: string, style: JssStyle, options?: RuleOptions): Rule | null {
    const rule = this.rules.add(name, style, options)
    if (!rule) return null
    this.options.jss.plugins.onProcessRule(rule)
    return rule
  }

  /**
   * Generates a CSS string.
   */
  toString(options?: ToCssOptions = defaultToStringOptions): string {
    if (options.indent == null) options.indent = defaultToStringOptions.indent
    if (options.children == null) options.children = defaultToStringOptions.children
    if (options.children === false) {
      return `${this.key} {}`
    }
    const children = this.rules.toString(options)
    return children ? `${this.key} {\n${children}\n}` : ''
  }
}

const keyRegExp = /@media|@supports\s+/

export default {
  onCreateRule(key: string, styles: JssStyle, options: RuleOptions): ConditionalRule | null {
    return keyRegExp.test(key) ? new ConditionalRule(key, styles, options) : null
  }
}
