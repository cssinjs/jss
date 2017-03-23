/* @flow */
import warning from 'warning'
import RegularRule from '../plugins/RegularRule'
import type {Rule, RuleOptions, JssStyle} from '../types'
import deepFreeze from '../utils/deepFreeze'

declare var __DEV__: boolean

/**
 * Create a rule instance.
 */
export default function createRule(name?: string, decl: JssStyle, options: RuleOptions): Rule {
  const {jss} = options

  // Throw in dev when somebody is trying to modify styles.
  if (__DEV__) deepFreeze(decl)

  if (jss) {
    const rule = jss.plugins.onCreateRule(name, decl, options)
    if (rule) return rule
  }

  // It is an at-rule and it has no instance.
  if (name && name[0] === '@') {
    warning(false, '[JSS] Unknown at-rule %s', name)
  }

  return new RegularRule(name, decl, options)
}
