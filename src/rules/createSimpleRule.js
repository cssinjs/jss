import createBaseRule from './createBaseRule'

/**
 * Create rules like @charset, @import, @namespace.
 *
 * @param {String} selector
 * @param {String} value
 * @param {Object} options
 * @return {Object}
 */
export default function createSimpleRule(name, value, options) {
  const rule = createBaseRule('simple', {name, value, options})

  /**
   * Generates a CSS string.
   *
   * @see toCSS
   */
  rule.toString = () => `${name} ${value};`

  return rule
}
