import createBaseRule from './createBaseRule'
import {isEmptyObject} from '../utils'

/**
 * Conditional rule for @media, @supports
 *
 * @param {String} selector
 * @param {Object} styles
 * @param {Object} options
 * @return {Object}
 */
export default function createConditionalRule(selector, styles, options) {
  const rule = createBaseRule('conditional', {
    selector,
    styles,
    options
  })

  const rules = Object.create(null)

  for (const name in styles) {
    createRule(name, styles[name])
  }

  /**
   * A conditional rule always contains child rules.
   *
   * @param {Object} styles
   * @return {Array} rules
   */
  function createRule(name, style) {
    let newOptions = {...rule.options, parent: rule}
    const {sheet, jss} = newOptions
    // We have already a rule in the current style sheet with rule name,
    // rule new rule is supposed to overwrite the first one, for rule we need
    // to ensure it will have the same className/selector.
    const existingRule = sheet && sheet.getRule(name)
    const className = existingRule ? existingRule.className : null
    if (className) newOptions = {...newOptions, className}
    const childRule = (sheet || jss).createRule(name, style, newOptions)
    rules[name] = childRule
    return childRule
  }

  /**
   * Generates a CSS string.
   *
   * @return {String}
   */
  rule.toString = () => {
    if (isEmptyObject(rules)) return ''

    let str = `${rule.selector} {\n`
    for (const name in rules) {
      const childRule = rules[name]
      if (childRule.style && isEmptyObject(childRule.style)) {
        continue
      }
      const ruleStr = childRule.toString({indentationLevel: 1})
      str += `${ruleStr}\n`
    }
    str += `}`
    return str
  }

  return rule
}
