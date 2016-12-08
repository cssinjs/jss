/* @flow */
import warning from 'warning'
import RegularRule from '../plugins/RegularRule'
import type {Rule, RuleOptions} from '../types'

/**
 * Create a rule instance.
 */
export default function createRule(name?: string, decl: Object = {}, options: RuleOptions): Rule {
  const {jss} = options
  // Is an at-rule.
  if (name && name[0] === '@' && jss) {
    const rule = jss.plugins.onCreateRule(name, decl, options)
    if (rule) return rule
    warning(false, '[JSS] Unknown rule %s', name)
  }

  return new RegularRule(name, decl, options)
}
