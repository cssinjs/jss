// @flow
import warning from 'tiny-warning'

/**
 * Simplified CSS parser.
 * - Requires new lines at the end of each declaration.
 * - Requires a closing curly brace of a nested rule to be on a separate line.
 */
const parse = (cssText: string): Object => {
  const style = {}
  const lines = cssText.split('\n')
  const rules = [style]

  for (let i = 0; i < lines.length; i++) {
    const decl = (lines[i] || '').trim()

    if (!decl) continue

    const ampIndex = decl.indexOf('&')

    if (ampIndex !== -1) {
      const openCurlyIndex = decl.indexOf('{')
      if (openCurlyIndex === -1) {
        warning(false, `[JSS] Missing opening curly brace in "${decl}".`)
        continue
      }
      const key = decl.substring(0, openCurlyIndex - 1)
      const nestedStyle = {}
      rules[rules.length - 1][key] = nestedStyle
      rules.push(nestedStyle)
      continue
    }

    // We are closing a nested rule.
    if (decl.indexOf('}') !== -1) {
      rules.pop()
      // Closing brace should be on it's own line, otherwise the rest on that line
      // will be ignored, so we should warn the user.
      if (decl.length !== 1) {
        warning(false, `[JSS] Missing opening curly brace in "${decl}".`)
      }
      continue
    }

    const colonIndex = decl.indexOf(':')

    if (colonIndex === -1) {
      warning(false, `[JSS] Missing colon in "${decl}".`)
      continue
    }

    const prop = decl.substring(0, colonIndex).trim()
    // We need to remove semicolon from value if there is one.
    const semi = decl[decl.length - 1] === ';' ? 1 : 0
    const value = decl.substring(colonIndex + 1, decl.length - semi).trim()
    rules[rules.length - 1][prop] = value
  }

  return style
}

export default parse
