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
 * @api private
 * @return {String}
 */
export function get() {
  return `jss-${versionCounter}-${ruleCounter++}`
}

/**
 * Resets the counter.
 *
 * @api private
 */
export function reset() {
  ruleCounter = 0
}
