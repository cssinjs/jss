/* @flow */
import createHash from 'murmurhash-js/murmurhash3_gc'
import type {Rule} from '../types'

/**
 * Generates a class name using murmurhash.
 */
export default function generateClassName(str: string, rule: Rule): string {
  const hash = createHash(str)
  // There is no name if `jss.createRule(styles)` was used.
  return rule.name ? `${rule.name}-${hash}` : hash
}
