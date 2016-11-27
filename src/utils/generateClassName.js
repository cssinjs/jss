import createHash from 'murmurhash-js/murmurhash3_gc'

/**
 * Generates a class name using murmurhash.
 *
 * @param {String} str
 * @param {Rule} rule
 * @return {String}
 */
export default function generateClassName(str, rule) {
  const hash = createHash(str)
  // There is no name if `jss.createRule(styles)` was used.
  return rule.name ? `${rule.name}-${hash}` : hash
}
