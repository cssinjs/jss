/**
 * Conditional rule for @media, @supports
 *
 * @api private
 */
export default class ConditionalRule {
  constructor(selector, styles, options) {
    this.type = 'conditional'
    this.selector = selector
    this.options = {...options, parent: this}
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
    const rules = Object.create(null)
    const {sheet, jss} = this.options
    for (const name in styles) {
      let localOptions = this.options
      // We have already a rule in the current style sheet with this name,
      // This new rule is supposed to overwrite the first one, for this we need
      // to ensure it will have the same className/selector.
      const ruleToOverwrite = this.options.sheet && this.options.sheet.getRule(name)
      if (ruleToOverwrite) localOptions = {...this.options, className: ruleToOverwrite.className}
      rules[name] = (sheet || jss).createRule(name, styles[name], localOptions)
    }
    return rules
  }

  /**
   * Generates a CSS string.
   *
   * @return {String}
   * @api private
   */
  toString() {
    let str = `${this.selector} {\n`
    for (const name in this.rules) {
      const ruleStr = this.rules[name].toString({indentationLevel: 1})
      str += `${ruleStr}\n`
    }
    str += `}`
    return str
  }
}
