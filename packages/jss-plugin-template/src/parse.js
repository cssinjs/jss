// @flow
import warning from 'tiny-warning'

const semiWithNl = /[;\n]|[}\n]/

/**
 * Naive CSS parser.
 * - Supports only rule body (no selectors)
 * - Requires semicolon and new line after the value (except of last line)
 * - No nested rules support
 */
export default (cssText: string): Object => {
  const style = {}
  const split = cssText.split(semiWithNl)
  let nestedRuleProp

  for (let i = 0; i < split.length; i++) {
    const decl = (split[i] || '').trim()

    if (!decl) continue

    if (nestedRuleProp === undefined) {
      const ampIndex = decl.indexOf('&')
      // We have a nested rule.
      if (ampIndex !== -1) {
        const openCurlyIndex = decl.indexOf('{')
        if (openCurlyIndex === -1) {
          warning(false, `[JSS] Missing opening curly brace in "${decl}".`)
          continue
        }
        nestedRuleProp = decl.substr(0, openCurlyIndex).trim()
        style[nestedRuleProp] = {}
        continue
      }
    } else {
      const closeCurlyIndex = decl.indexOf('}')
      if (closeCurlyIndex !== -1) {
        nestedRuleProp = undefined
        continue
      }
    }

    const colonIndex = decl.indexOf(':')
    if (colonIndex === -1) {
      warning(false, `[JSS] Missing colon in "${decl}".`)
      continue
    }

    const prop = decl.substr(0, colonIndex).trim()
    const value = decl.substr(colonIndex + 1).trim()

    if (nestedRuleProp) {
      style[nestedRuleProp][prop] = value
    } else {
      style[prop] = value
    }
  }
  return style
}
