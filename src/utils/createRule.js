/* @flow */
import warning from 'warning'
import StyleRule from '../rules/StyleRule'
import type {Rule, RuleOptions, JssStyle} from '../types'
import cloneStyle from '../utils/cloneStyle'

/**
 * Create a rule instance.
 */
export default function createRule(
  name: string = 'unnamed',
  decl: JssStyle,
  options: RuleOptions
): Rule {
  const {jss} = options
  const declCopy = cloneStyle(decl)

  const rule = jss.plugins.onCreateRule(name, declCopy, options)
  if (rule) return rule

  // It is an at-rule and it has no instance.
  if (name[0] === '@') {
    warning(false, '[JSS] Unknown at-rule %s', name)
  }

  return new StyleRule(name, declCopy, options)
}
