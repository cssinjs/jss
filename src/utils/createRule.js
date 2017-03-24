/* @flow */
import warning from 'warning'
import RegularRule from '../plugins/RegularRule'
import type {Rule, RuleOptions, JssStyle} from '../types'
import deepFreeze from '../utils/deepFreeze'
import cloneStyle from '../utils/cloneStyle'

declare var __DEV__: boolean

/**
 * Create a rule instance.
 */
export default function createRule(name?: string, decl: JssStyle, options: RuleOptions): Rule {
  const {jss} = options
  const declCopy = cloneStyle(decl)

  // Throw in dev when somebody is trying to modify users original styles.
  if (__DEV__) deepFreeze(decl)

  if (jss) {
    const rule = jss.plugins.onCreateRule(name, declCopy, options)
    if (rule) return rule
  }

  // It is an at-rule and it has no instance.
  if (name && name[0] === '@') {
    warning(false, '[JSS] Unknown at-rule %s', name)
  }

  return new RegularRule(name, declCopy, options)
}
