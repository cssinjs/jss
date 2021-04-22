// @flow
import toCssValue from './toCssValue'
import type {ToCssOptions, JssStyle} from '../types'

/**
 * Indent a string.
 * http://jsperf.com/array-join-vs-for
 */
function indentStr(str: string, indent: number): string {
  let result = ''
  for (let index = 0; index < indent; index++) result += '  '
  return result + str
}

/**
 * Converts a Rule to CSS string.
 */
export default function toCss(
  selector?: string,
  style: JssStyle,
  options: ToCssOptions = ({}: any)
): string {
  let result = ''

  if (!style) return result

  let {indent = 0} = options
  const {fallbacks} = style

  if (selector) indent++

  // Apply fallbacks first.
  if (fallbacks) {
    // Array syntax {fallbacks: [{prop: value}]}
    if (Array.isArray(fallbacks)) {
      for (let index = 0; index < fallbacks.length; index++) {
        const fallback = fallbacks[index]
        for (const prop in fallback) {
          const value = fallback[prop]
          if (value != null) {
            if (result) result += '\n'
            result += indentStr(`${prop}: ${toCssValue(value)};`, indent)
          }
        }
      }
    } else {
      // Object syntax {fallbacks: {prop: value}}
      for (const prop in fallbacks) {
        const value = fallbacks[prop]
        if (value != null) {
          if (result) result += '\n'
          result += indentStr(`${prop}: ${toCssValue(value)};`, indent)
        }
      }
    }
  }

  for (const prop in style) {
    const value = style[prop]
    if (value != null && prop !== 'fallbacks') {
      if (result) result += '\n'
      result += indentStr(`${prop}: ${toCssValue(value)};`, indent)
    }
  }

  // Allow empty style in this case, because properties will be added dynamically.
  if (!result && !options.allowEmpty) return result

  // When rule is being stringified before selector was defined.
  if (!selector) return result

  indent--

  if (result) result = `\n${result}\n`

  return indentStr(`${selector} {${result}`, indent) + indentStr('}', indent)
}
