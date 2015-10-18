let globalReference = typeof window === `undefined` ? global : window
let namespace = `__JSS_UID_PREFIX__`
if (globalReference[namespace] == null) globalReference[namespace] = 0

let prefix = globalReference[namespace]++
let counter = 0

/**
 * Returns a uid.
 * Ensures uniqueness if more than 1 jss version is used.
 *
 * @api private
 * @return {String}
 */
export function get() {
  return `${prefix}-${counter++}`
}

/**
 * Resets the counter.
 *
 * @api private
 */
export function reset() {
  counter = 0
}
