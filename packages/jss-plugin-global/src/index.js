import {RuleList} from 'jss'

const at = '@global'
const atPrefix = '@global '

class GlobalContainerRule {
  type = 'global'

  at = at

  isProcessed = false

  constructor(key, styles, options) {
    this.key = key
    this.options = options
    this.rules = new RuleList({
      ...options,
      parent: this
    })

    for (const selector in styles) {
      this.rules.add(selector, styles[selector])
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
   * Create and register rule, run plugins.
   */
  addRule(name, style, options) {
    const rule = this.rules.add(name, style, options)
    if (rule) this.options.jss.plugins.onProcessRule(rule)
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
   * Get index of a rule.
   */
  indexOf(rule) {
    return this.rules.indexOf(rule)
  }

  /**
   * Generates a CSS string.
   */
  toString() {
    return this.rules.toString()
  }
}

class GlobalPrefixedRule {
  type = 'global'

  at = at

  isProcessed = false

  constructor(key, style, options) {
    this.key = key
    this.options = options
    const selector = key.substr(atPrefix.length)
    this.rule = options.jss.createRule(selector, style, {
      ...options,
      parent: this
    })
  }

  toString(options) {
    return this.rule ? this.rule.toString(options) : ''
  }
}

const separatorRegExp = /\s*,\s*/g

function addScope(selector, scope) {
  const parts = selector.split(separatorRegExp)
  let scoped = ''
  for (let i = 0; i < parts.length; i++) {
    scoped += `${scope} ${parts[i].trim()}`
    if (parts[i + 1]) scoped += ', '
  }
  return scoped
}

function handleNestedGlobalContainerRule(rule, sheet) {
  const {options, style} = rule
  const rules = style ? style[at] : null

  if (!rules) return

  for (const name in rules) {
    sheet.addRule(name, rules[name], {
      ...options,
      selector: addScope(name, rule.selector)
    })
  }

  delete style[at]
}

function handlePrefixedGlobalRule(rule, sheet) {
  const {options, style} = rule
  for (const prop in style) {
    if (prop[0] !== '@' || prop.substr(0, at.length) !== at) continue

    const selector = addScope(prop.substr(at.length), rule.selector)
    sheet.addRule(selector, style[prop], {
      ...options,
      selector
    })
    delete style[prop]
  }
}

/**
 * Convert nested rules to separate, remove them from original styles.
 */
export default function jssGlobal() {
  function onCreateRule(name, styles, options) {
    if (!name) return null

    if (name === at) {
      return new GlobalContainerRule(name, styles, options)
    }

    if (name[0] === '@' && name.substr(0, atPrefix.length) === atPrefix) {
      return new GlobalPrefixedRule(name, styles, options)
    }

    const {parent} = options

    if (parent) {
      if (
        parent.type === 'global' ||
        (parent.options.parent && parent.options.parent.type === 'global')
      ) {
        options.scoped = false
      }
    }

    if (!options.selector && options.scoped === false) {
      options.selector = name
    }

    return null
  }

  function onProcessRule(rule, sheet) {
    if (rule.type !== 'style' || !sheet) return

    handleNestedGlobalContainerRule(rule, sheet)
    handlePrefixedGlobalRule(rule, sheet)
  }

  return {onCreateRule, onProcessRule}
}
