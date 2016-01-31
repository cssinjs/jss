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
}())
