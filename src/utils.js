import createHash from 'murmurhash-js/murmurhash3_gc'

/**
 * Generates a class name using murmurhash.
 *
 * @param {String} str
 * @param {Rule} rule
 * @return {String}
 */
export function generateClassName(str, rule) {
  const hash = createHash(str)
  return rule.name ? `${rule.name}-${hash}` : hash
}

/**
 * Determine whether an object is empty or not.
 * More performant than a `Object.keys(obj).length > 0`
 *
 * @param {Object} obj
 * @return {Boolean}
 */
export function isEmptyObject(obj) {
  for (const key in obj) return false // eslint-disable-line no-unused-vars

  return true
}

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
export function toCSS(selector, style, options = {}) {
  let indentationLevel = options.indentationLevel || 0
  let str = ''

  if (options.selector !== false) {
    str += indent(indentationLevel, `${selector} {`)
    indentationLevel++
  }

  const {fallbacks} = style

  // Apply fallbacks first.
  if (fallbacks) {
    // Array syntax {fallbacks: [{prop: value}]}
    if (Array.isArray(fallbacks)) {
      for (let index = 0; index < fallbacks.length; index++) {
        const fallback = fallbacks[index]
        for (const prop in fallback) {
          str += `\n${indent(indentationLevel, `${prop}: ${fallback[prop]};`)}`
        }
      }
    }
    // Object syntax {fallbacks: {prop: value}}
    else {
      for (const prop in fallbacks) {
        str += `\n${indent(indentationLevel, `${prop}: ${fallbacks[prop]};`)}`
      }
    }
  }

  for (const prop in style) {
    if (prop !== 'fallbacks') {
      str += `\n${indent(indentationLevel, `${prop}: ${style[prop]};`)}`
    }
  }

  if (options.selector !== false) str += `\n${indent(--indentationLevel, '}')}`

  return str
}

/**
 * Get class names from a selector.
 *
 * @param {String} selector
 * @return {String}
 */
export const findClassNames = (() => {
  const dotsRegExp = /[.]/g
  const classesRegExp = /[.][^ ,]+/g

  return (selector) => {
    const classes = selector.match(classesRegExp)

    if (!classes) return ''

    return classes
      .join(' ')
      .replace(dotsRegExp, '')
  }
})()
