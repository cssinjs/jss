import {isEmptyObject} from '../utils'

/**
 * Conditional rule for @media, @supports
 *
 * @api public
 */
export default class ConditionalRule {
  constructor(selector, styles, options) {
    this.type = 'conditional'
    this.selector = selector
    this.options = options
    this.rules = Object.create(null)
    for (const name in styles) {
      this.createRule(name, styles[name])
    }
  }

  /**
   * A conditional rule always contains child rules.
   *
   * @param {Object} styles
   * @return {Array} rules
   * @api public
   */
  createRule(name, style, options) {
    let newOptions = {...this.options, parent: this}
    const {sheet, jss} = newOptions
    // We have already a rule in the current style sheet with this name,
    // This new rule is supposed to overwrite the first one, for this we need
    // to ensure it will have the same className/selector.
    const existingRule = sheet && sheet.getRule(name)
    const className = existingRule ? existingRule.className : null
    if (className || options) {
      newOptions = {...newOptions, className, ...options}
    }
    const rule = (sheet || jss).createRule(name, style, newOptions)
    this.rules[name] = rule
    return rule
  }

  /**
   * Generates a CSS string.
   *
   * @return {String}
   * @api public
   */
  toString() {
    let str = `${this.selector} {\n`
    for (const name in this.rules) {
      const rule = this.rules[name]
      if (rule.style && isEmptyObject(rule.style)) {
        continue
      }
      const ruleStr = rule.toString({indentationLevel: 1})
      str += `${ruleStr}\n`
    }
    str += '}'
    return str
  }
}
