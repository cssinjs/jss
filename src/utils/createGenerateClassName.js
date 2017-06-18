/* @flow */
import type {Rule, generateClassName} from '../types'

const globalRef = typeof window === 'undefined' ? global : window
const namespace = '__JSS_VERSION_COUNTER__'
if (globalRef[namespace] == null) globalRef[namespace] = 0
// In case we have more than one JSS version.
const jssCounter = globalRef[namespace]++

/**
 * Returns a function which generates unique class names based on counters.
 * When new generator function is created, rule counter is reseted.
 * We need to reset the rule counter for SSR for each request.
 */
export default (): generateClassName => {
  let ruleCounter = 0

  return (rule: Rule): string => `${rule.key}-${jssCounter}-${ruleCounter++}`
}
