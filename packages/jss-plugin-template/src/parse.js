// @flow
import warning from 'tiny-warning'

/**
 * A simplified CSS parser.
 *
 * This parser is not meant to be a complete one but to enable authoring styles
 * using a template string with nesting syntax support, fastest parse performance and small footprint.
 *
 * Design of this parser has two main principles:
 *
 * 1. It does not parse entire CSS. It uses only specific markers to separate selectors from props and values.
 * 2. It uses warnings to make sure expected syntax is used instead of supporting the full syntax.
 *
 * To do that it requires some constraints:
 *  - Parser expects a new line after each declaration (`color: red;\n`).
 *  - Parser expects an ampersand, selector and opening curly brace for nesting syntax on a single line (`& selector {`).
 *  - Parser expects a closing curly brace on a separate line.
 *
 * Example
 *
 * `
 * color: red;
 * &:hover {
 *   color: green;
 * }
 * `
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
        warning(false, `[JSS] Missing closing curly brace in "${decl}".`)
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
