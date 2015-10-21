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
export default function clone(obj) {
  return parse(stringify(obj))
}
