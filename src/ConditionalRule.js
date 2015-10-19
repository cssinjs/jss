/**
 * Conditional rule for @media, @supports
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
    let rules = {}
    let options = {...this.options, parent: this}
    let {sheet, jss} = options
    for (let name in styles) {
      let localOptions = options
      // We have already a rule in the current style sheet with this name,
      // This new rule is supposed to overwrite the first one, for this we need
      // to ensure it will have the same className/selector.
      let ruleToOverwrite = options.sheet && options.sheet.getRule(name)
      if (ruleToOverwrite) localOptions = {...options, className: ruleToOverwrite.className}
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
    for (let name in this.rules) {
      let ruleStr = this.rules[name].toString({indentationLevel: 1})
      str += `${ruleStr}\n`
    }
    str += `}`
    return str
  }
}
