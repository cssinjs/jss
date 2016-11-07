import createHash from 'murmurhash-js/murmurhash3_gc'

/**
 * Generates a class name using murmurhash.
 *
 * @param {String} str
 * @param {Rule} rule
 * @return {String}
 */
export function generateClassName(str, rule) {
  const {name, options: {sheet}} = rule
  const hash = createHash(str)

  let className = name ? `${name}-${hash}` : hash

  if (sheet && sheet.options.meta) {
    className = `${sheet.options.meta}_${className}`
  }

  return className
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
 * Converts array values to string.
 *
 * `margin: [['5px', '10px']]` > `margin: 5px 10px;`
 * `border: ['1px', '2px']` > `border: 1px, 2px;`
 *
 * @param {Array} value
 * @return {String|Number|Object}
 */
export const toCssValue = (() => {
  function joinWithSpace(value) {
    return value.join(' ')
  }

  return function joinWithComma(value) {
    if (!Array.isArray(value)) return value

    // Support space separated values.
    if (Array.isArray(value[0])) {
      return joinWithComma(value.map(joinWithSpace))
    }

    return value.join(', ')
  }
})()

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
export function toCss(selector, style, options = {}) {
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
