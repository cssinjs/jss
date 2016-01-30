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

/*
 * Determine whether an object is empty or not.
 * More performant than a `Object.keys(obj).length > 0`
 */
export function isEmptyObject(obj) {
  for (const key in obj) return false // eslint-disable-line no-unused-vars

  return true
}
