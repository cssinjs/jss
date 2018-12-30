/* @flow */
import warning from 'tiny-warning'
import type {Rule, GenerateId} from '../types'
import StyleSheet from '../StyleSheet'
import moduleId from './moduleId'

const maxRules = 1e10

/**
 * Returns a function which generates unique class names based on counters.
 * When new generator function is created, rule counter is reseted.
 * We need to reset the rule counter for SSR for each request.
 */
export default (): GenerateId => {
  let ruleCounter = 0
  const env = process.env.NODE_ENV
  const defaultPrefix = env === 'production' ? 'c' : ''

  return (rule: Rule, sheet?: StyleSheet): string => {
    ruleCounter += 1

    if (ruleCounter > maxRules) {
      warning(false, `[JSS] You might have a memory leak. Rule counter is at ${ruleCounter}.`)
    }

    let prefix = defaultPrefix
    let jssId = ''

    if (sheet) {
      prefix = sheet.options.classNamePrefix || defaultPrefix
      if (sheet.options.jss.id != null) jssId += sheet.options.jss.id
    }

    if (env === 'production') {
      return `${prefix}${moduleId}${jssId}${ruleCounter}`
    }

    return `${prefix + rule.key}-${moduleId}${jssId && `-${jssId}`}-${ruleCounter}`
  }
}
