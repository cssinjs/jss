/* @flow */
import warning from 'warning'
import RegularRule from '../plugins/RegularRule'
import type {Rule, RuleOptions} from '../types'

/**
 * Create a rule instance.
 */
export default function createRule(name?: string, decl: Object = {}, options: RuleOptions): Rule {
  const {jss} = options
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
