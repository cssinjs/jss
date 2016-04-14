import createRegularRule from './rules/createRegularRule'
import createConditionalRule from './rules/createConditionalRule'
import createFontFaceRule from './rules/createFontFaceRule'
import createSimpleRule from './rules/createSimpleRule'
import createKeyframeRule from './rules/createKeyframeRule'

/**
 * Map of at rules to corresponding implementation class.
 *
 * @type {Object}
 */
const atRuleCreatorMap = {
  '@charset': createSimpleRule,
  '@import': createSimpleRule,
  '@namespace': createSimpleRule,
  '@keyframes': createKeyframeRule,
  '@media': createConditionalRule,
  '@supports': createConditionalRule,
  '@font-face': createFontFaceRule
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
  let create = createRegularRule
  // Is an at-rule.
  if (selector && selector[0] === '@') {
    const atRule = atRuleNameRegExp.exec(selector)[0]
    create = atRuleCreatorMap[atRule]
  }
  if (options.named == null) options.named = true
  return create(selector, style, options)
}

