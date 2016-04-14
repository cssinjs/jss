const stringify = JSON.stringify
const parse = JSON.parse

/**
 * Deeply clone object using serialization.
 * Expects object to be plain and without cyclic dependencies.
 *
 * http://jsperf.com/lodash-deepclone-vs-jquery-extend-deep/6
 *
 * @type {Object} obj
 * @return {Object}
 */
export function clone(obj) {
  return parse(stringify(obj))
}

/**
 * Determine whether an object is empty or not.
 * More performant than a `Object.keys(obj).length > 0`
 *
 * @type {Object} obj
 * @return {Boolean}
 */
export function isEmptyObject(obj) {
  for (const key in obj) return false // eslint-disable-line no-unused-vars

  return true
}

/**
 * Simple very fast UID generation based on a global counter.
 */
export const uid = (() => {
  const globalReference = typeof window == 'undefined' ? global : window
  const namespace = '__JSS_VERSION_COUNTER__'
  if (globalReference[namespace] == null) globalReference[namespace] = 0

  // In case we have more than one jss version.
  const versionCounter = globalReference[namespace]++
  let ruleCounter = 0

  /**
   * Returns a uid.
   * Ensures uniqueness if more than 1 jss version is used.
   *
   * @api public
   * @return {String}
   */
  function get() {
    return `jss-${versionCounter}-${ruleCounter++}`
  }

  /**
   * Resets the counter.
   *
   * @api public
   */
  function reset() {
    ruleCounter = 0
  }

  return {get, reset}
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
export function toCSS(selector, style, options = {}) {
  let indentationLevel = options.indentationLevel || 0
  let str = ''

  if (options.selector !== false) {
    str += indent(indentationLevel, `${selector} {`)
    indentationLevel++
  }

  for (const prop in style) {
    const value = style[prop]
    // We want to generate multiple style with identical property names.
    if (Array.isArray(value)) {
      for (let index = 0; index < value.length; index++) {
        str += '\n' + indent(indentationLevel, `${prop}: ${value[index]};`)
      }
    }
    else str += '\n' + indent(indentationLevel, `${prop}: ${value};`)
  }

  if (options.selector !== false) str += '\n' + indent(--indentationLevel, '}')

  return str
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
