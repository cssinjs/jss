import toCssValue from './toCssValue'

/**
 * Indent a string.
 *
 * http://jsperf.com/array-join-vs-for
 *
 * @param {Number} level
 * @param {String} str
 * @return {String}
 */
function indent(level, str) {
  let indentStr = ''
  for (let index = 0; index < level; index++) indentStr += '  '
  return indentStr + str
}

/**
 * Converts a Rule to CSS string.
 *
 * Options:
 * - `selector` use `false` to get a rule without selector
 * - `indentationLevel` level of indentation
 *
 * @param {String} selector
 * @param {Object} style
 * @param {Object} options
 * @return {String}
 */
export default function toCss(selector, style, options = {}) {
  let indentationLevel = options.indentationLevel || 0
  let str = ''

  const {fallbacks} = style

  if (options.selector !== false) indentationLevel++

  // Apply fallbacks first.
  if (fallbacks) {
    // Array syntax {fallbacks: [{prop: value}]}
    if (Array.isArray(fallbacks)) {
      for (let index = 0; index < fallbacks.length; index++) {
        const fallback = fallbacks[index]
        for (const prop in fallback) {
          const value = fallback[prop]
          if (value != null) {
            str += `\n${indent(indentationLevel, `${prop}: ${toCssValue(value)};`)}`
          }
        }
      }
    }
    // Object syntax {fallbacks: {prop: value}}
    else {
      for (const prop in fallbacks) {
        const value = fallbacks[prop]
        if (value != null) {
          str += `\n${indent(indentationLevel, `${prop}: ${toCssValue(value)};`)}`
        }
      }
    }
  }

  for (const prop in style) {
    const value = style[prop]
    if (value != null && prop !== 'fallbacks') {
      str += `\n${indent(indentationLevel, `${prop}: ${toCssValue(value)};`)}`
    }
  }

  if (!str) return str

  if (options.selector !== false) {
    indentationLevel--
    str = indent(indentationLevel, `${selector} {${str}\n`) + indent(indentationLevel, '}')
  }

  return str
}
