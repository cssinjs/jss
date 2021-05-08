import warning from 'tiny-warning'
import cloneStyle from './cloneStyle'

/**
 * Create a rule instance.
 */
export default function createRule(name = 'unnamed', decl, options) {
  const {jss} = options
  const declCopy = cloneStyle(decl)

  const rule = jss.plugins.onCreateRule(name, declCopy, options)
  if (rule) return rule

  // It is an at-rule and it has no instance.
  if (name[0] === '@') {
    warning(false, `[JSS] Unknown rule ${name}`)
  }

  return null
}
