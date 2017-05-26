/* @flow */
import type {Rule, generateClassName} from '../types'

const globalRef = typeof window === 'undefined' ? global : window
const namespace = '__JSS_VERSION_COUNTER__'
if (globalRef[namespace] == null) globalRef[namespace] = 0
// In case we have more than one JSS version.
const jssCounter = globalRef[namespace]++

export const createGenerateClassName = () : generateClassName => {
  let ruleCounter = 0
  /**
   * Generates unique class names.
   */
  return (rule: Rule): string => (
    // There is no rule name if `jss.createRule(style)` was used.
    `${rule.name || 'jss'}-${jssCounter}-${ruleCounter++}`
  )
}

export default createGenerateClassName()
