import createBaseRule from './createBaseRule'
import {toCSS} from '../utils'

/**
 * Create a font-face rule.
 *
 * @return {Object}
 */
export default function createFontFaceRule(selector, style, options) {
  const rule = createBaseRule('font-face', {selector, style, options})

  /**
   * Generates a CSS string.
   *
   * @see toCSS
   */
  rule.toString = (options) => toCSS(rule, options)

  return rule
}
