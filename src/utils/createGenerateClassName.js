/* @flow */
import warning from 'warning'
import type {Rule, generateClassName} from '../types'
import StyleSheet from '../StyleSheet'
import global from './global'

const ns = '2f1acc6c3a606b082e5eef5e54414ffb'
if (global[ns] == null) global[ns] = 0
// In case we have more than one JSS version.
const jssCounter = global[ns]++

const maxRules = 1e10

const env = process.env.NODE_ENV

/**
 * Returns a function which generates unique class names based on counters.
 * When new generator function is created, rule counter is reseted.
 * We need to reset the rule counter for SSR for each request.
 */
export default (): generateClassName => {
  let ruleCounter = 0

  return (rule: Rule, sheet?: StyleSheet): string => {
    ruleCounter += 1

    if (ruleCounter > maxRules) {
      warning(
        false,
        '[JSS] You might have a memory leak. Rule counter is at %s.',
        ruleCounter
      )
    }

    if (env === 'production') {
      return `c${jssCounter}${ruleCounter}`
    }

    const prefix = sheet ? (sheet.options.classNamePrefix || '') : ''
    return `${prefix + rule.key}-${jssCounter}-${ruleCounter}`
  }
}
