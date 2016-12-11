/* @flow */
import createHash from 'murmurhash-js/murmurhash3_gc'
import type StyleSheet from '../StyleSheet'
import type {Rule} from '../types'

/**
 * Generates a class name using murmurhash.
 */
export default function generateClassName(str: string, rule: Rule, sheet?: StyleSheet): string {
  if (sheet && sheet.options.meta) str += sheet.options.meta

  const hash = createHash(str)

  // There is no name if `jss.createRule(style)` was used.
  return rule.name ? `${rule.name}-${hash}` : hash
}
