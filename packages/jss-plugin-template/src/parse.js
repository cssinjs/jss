// @flow
import warning from 'tiny-warning'
import type {JssStyle} from 'jss'

const semiWithNl = /;\n/

type Parse = string => JssStyle

/**
 * Naive CSS parser.
 * - Supports only rule body (no selectors)
 * - Requires semicolon and new line after the value (except of last line)
 * - No nested rules support
 */
const parse: Parse = cssText => {
  const style = {}
  const split = cssText.split(semiWithNl)
  for (let i = 0; i < split.length; i++) {
    const decl = (split[i] || '').trim()

    if (!decl) continue
    const colonIndex = decl.indexOf(':')
    if (colonIndex === -1) {
      warning(false, `[JSS] Malformed CSS string "${decl}"`)
      continue
    }
    const prop = decl.substr(0, colonIndex).trim()
    const value = decl.substr(colonIndex + 1).trim()
    style[prop] = value
  }
  return style
}

export default parse
