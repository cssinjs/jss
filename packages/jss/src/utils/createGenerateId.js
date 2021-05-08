import warning from 'tiny-warning'
import moduleId from './moduleId'

const maxRules = 1e10

/**
 * Returns a function which generates unique class names based on counters.
 * When new generator function is created, rule counter is reseted.
 * We need to reset the rule counter for SSR for each request.
 */
const createGenerateId = (options = {}) => {
  let ruleCounter = 0

  const generateId = (rule, sheet) => {
    ruleCounter += 1

    if (ruleCounter > maxRules) {
      warning(false, `[JSS] You might have a memory leak. Rule counter is at ${ruleCounter}.`)
    }

    let jssId = ''
    let prefix = ''

    if (sheet) {
      if (sheet.options.classNamePrefix) {
        prefix = sheet.options.classNamePrefix
      }
      if (sheet.options.jss.id != null) {
        jssId = String(sheet.options.jss.id)
      }
    }

    if (options.minify) {
      // Using "c" because a number can't be the first char in a class name.
      return `${prefix || 'c'}${moduleId}${jssId}${ruleCounter}`
    }

    return `${prefix + rule.key}-${moduleId}${jssId ? `-${jssId}` : ''}-${ruleCounter}`
  }

  return generateId
}

export default createGenerateId
