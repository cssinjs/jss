import warning from 'warning'
import RegularRule from '../plugins/RegularRule'

/**
 * Create a rule instance.
 *
 * @param {Object} [name]
 * @param {Object} [decl] declarations block
 * @param {Object} [options] rule options
 * @return {Object} rule
 * @api public
 */
export default function createRule(name, decl = {}, options = {}) {
  // Is an at-rule.
  if (name && name[0] === '@') {
    const rule = options.jss.plugins.onCreateRule(name, decl, options)
    if (rule) return rule
    warning(false, '[JSS] Unknown rule %s', name)
  }

  return new RegularRule(name, decl, options)
}
