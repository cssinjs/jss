/**
 * Conditional rule for @media, @supports, @font-face
 *
 * @api private
 */
export default class ConditionalRule {
  constructor(selector, styles, options) {
    this.type = 'conditional'
    this.selector = selector
    this.options = options
    this.rules = this.createChildRules(styles)
  }

  /**
   * A conditional rule always contains child rules.
   *
   * @param {Object} styles
   * @return {Array} rules
   * @api private
   */
  createChildRules(styles) {
    let rules = []
    let options = {...this.options, parent: this}
    for (let name in styles) {
      let localOptions = options
      // We have already a rule in the current style sheet with this name,
      // This new rule is supposed to overwrite the first one, for this we need
      // to ensure it will have the same className/selector.
      let ruleToOverwrite = options.sheet && options.sheet.getRule(name)
      if (ruleToOverwrite) localOptions = {...options, className: ruleToOverwrite.className}
      let rule = this.createRule(name, styles[name], localOptions)
      rules.push(rule)
    }
    return rules
  }

  /**
   * Create rule independant if this rule is part of a sheet or not.
   *
   * @see createRule
   * @api private
   */
  createRule(name, style, options) {
    let {sheet, jss} = this.options
    if (sheet) return sheet.createRule(name, style, options)
    return jss.createRule(name, style, options)
  }

  /**
   * Generates a CSS string.
   *
   * @return {String}
   * @api private
   */
  toString() {
    let str = `${this.selector} {\n`
    for (let i = 0; i < this.rules.length; i++) {
      let ruleStr = this.rules[i].toString({indentationLevel: 1})
      str += `${ruleStr}\n`
    }
    str += `}`
    return str
  }
}


