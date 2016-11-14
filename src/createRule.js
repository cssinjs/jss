import warning from 'warning'
import Rule from './rules/Rule'
import SimpleRule from './rules/SimpleRule'
import KeyframeRule from './rules/KeyframeRule'
import ConditionalRule from './rules/ConditionalRule'
import FontFaceRule from './rules/FontFaceRule'

/**
 * Map of at rules to corresponding implementation class.
 *
 * @type {Object}
 */
const atRuleClassMap = {
  '@charset': SimpleRule,
  '@import': SimpleRule,
  '@namespace': SimpleRule,
  '@keyframes': KeyframeRule,
  '@media': ConditionalRule,
  '@supports': ConditionalRule,
  '@font-face': FontFaceRule
}

const atRuleNameRegExp = new RegExp(`^${Object.keys(atRuleClassMap).join('|')}`)

/**
 * Create rule factory.
 *
 * Options:
 *   - `named` pass `false` if selector argument is defined by user
 *   - `className` pass class name if you to define it manually
 *
 * @param {Object} [selector] if you don't pass selector - it will be generated
 * @param {Object} [style] declarations block
 * @param {Object} [options] rule options
 * @return {Object} rule
 * @api private
 */
export default function createRule(selector, style = {}, options = {}) {
  let RuleClass = Rule

  // Is an at-rule.
  if (selector && selector[0] === '@') {
    const result = atRuleNameRegExp.exec(selector)
    if (result) RuleClass = atRuleClassMap[result[0]]
    else warning(false, '[JSS] Unknown at-rule %s', selector)
  }

  if (options.named == null) options.named = true

  return new RuleClass(selector, style, options)
}
