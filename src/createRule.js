import Rule from './rules/Rule'
import SimpleRule from './rules/SimpleRule'
import KeyframeRule from './rules/KeyframeRule'
import ConditionalRule from './rules/ConditionalRule'

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
  '@font-face': Rule
}

const atRuleNameRegExp = /^@[^ ]+/

/**
 * Create rule factory.
 *
 * @param {Object} [selector] if you don't pass selector - it will be generated
 * @param {Object} [style] declarations block
 * @param {Object} [options] rule options
 * @return {Object} rule
 * @api private
 */
export default function createRule(selector, style = {}, options = {}) {
  // Is an at-rule.
  if (selector && selector[0] === '@') {
    const name = atRuleNameRegExp.exec(selector)[0]
    const AtRule = atRuleClassMap[name]
    // We use regular rule class to handle font rule,
    // font-face rule should not be named.
    if (name === '@font-face' && options.named) {
      options = {...options, named: false}
    }
    return new AtRule(selector, style, options)
  }
  if (options.named == null) options.named = true
  return new Rule(selector, style, options)
}

