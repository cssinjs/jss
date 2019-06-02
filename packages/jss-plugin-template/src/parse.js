// @flow
import warning from 'tiny-warning'
import type {JssStyles} from 'jss'

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

// Test implementation without using .split()
const parse = (cssText: string): JssStyles => {
  const style = {}
  const rules = [style]
  let line
  let done
  let prevNlIndex = 0

  while (!done) {
    const nextNlIndex = cssText.indexOf('\n', prevNlIndex)

    if (nextNlIndex === -1) {
      done = true
      line = cssText.substring(prevNlIndex).trim()
    } else {
      line = cssText.substring(prevNlIndex, nextNlIndex).trim()
      prevNlIndex = nextNlIndex + 1
    }

    if (!line) continue

    const ampIndex = line.indexOf('&')

    if (ampIndex !== -1) {
      const openCurlyIndex = line.indexOf('{')
      if (openCurlyIndex === -1) {
        warning(false, `[JSS] Missing opening curly brace in "${line}".`)
        break
      }
      const key = line.substring(0, openCurlyIndex - 1).trim()
      const nestedStyle = {}
      rules[rules.length - 1][key] = nestedStyle
      rules.push(nestedStyle)
      continue
    }

    // We are closing a nested rule.
    if (line === '}') {
      rules.pop()
      continue
    }

    // We are closing a nested rule, but the curly brace is not on a separate line.
    if (process.env.NODE_ENV !== 'production' && line.indexOf('}') !== -1) {
      warning(false, `[JSS] Missing closing curly brace in "${line}".`)
      continue
    }

    const colonIndex = line.indexOf(':')

    if (colonIndex === -1) {
      warning(false, `[JSS] Missing colon in "${line}".`)
    }

    const prop = line.substring(0, colonIndex).trim()
    // We need to remove semicolon from value if there is one.
    const semi = line[line.length - 1] === ';' ? 1 : 0
    const value = line.substring(colonIndex + 1, line.length - semi).trim()
    rules[rules.length - 1][prop] = value
  }

  return style
}

export default parse

// Temporarily here for comparison.
export const parse2 = (cssText: string): JssStyles => {
  const style = {}
  const lines = cssText.split('\n')
  const rules = [style]

  for (let i = 0; i < lines.length; i++) {
    const decl = lines[i].trim()

    if (!decl) continue

    const ampIndex = decl.indexOf('&')

    if (ampIndex !== -1) {
      const openCurlyIndex = decl.indexOf('{')
      if (openCurlyIndex === -1) {
        warning(false, `[JSS] Missing opening curly brace in "${decl}".`)
        break
      }
      const key = decl.substring(0, openCurlyIndex - 1).trim()
      const nestedStyle = {}
      rules[rules.length - 1][key] = nestedStyle
      rules.push(nestedStyle)
      continue
    }

    // We are closing a nested rule.
    if (decl === '}') {
      rules.pop()
      continue
    }

    // We are closing a nested rule, but the curly brace is not on a separate line.
    if (process.env.NODE_ENV !== 'production' && decl.indexOf('}') !== -1) {
      warning(false, `[JSS] Missing closing curly brace in "${decl}".`)
      continue
    }

    const colonIndex = decl.indexOf(':')

    if (colonIndex === -1) {
      warning(false, `[JSS] Missing colon in "${decl}".`)
    }

    const prop = decl.substring(0, colonIndex).trim()
    // We need to remove semicolon from value if there is one.
    const semi = decl[decl.length - 1] === ';' ? 1 : 0
    const value = decl.substring(colonIndex + 1, decl.length - semi).trim()
    rules[rules.length - 1][prop] = value
  }

  return style
}
