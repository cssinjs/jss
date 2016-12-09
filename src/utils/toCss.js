/* @flow */
import toCssValue from './toCssValue'
import type {ToCssOptions as Options} from '../types'

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
export default function toCss(selector: string, style: Object, options: Options = {}): string {
  let {indent = 0} = options
  const {fallbacks} = style
  let result = ''

  indent++

  // Apply fallbacks first.
  if (fallbacks) {
    // Array syntax {fallbacks: [{prop: value}]}
    if (Array.isArray(fallbacks)) {
      for (let index = 0; index < fallbacks.length; index++) {
        const fallback = fallbacks[index]
        for (const prop in fallback) {
          const value = fallback[prop]
          if (value != null) {
            result += `\n${indentStr(`${prop}: ${toCssValue(value)};`, indent)}`
          }
        }
      }
    }
    // Object syntax {fallbacks: {prop: value}}
    else {
      for (const prop in fallbacks) {
        const value = fallbacks[prop]
        if (value != null) {
          result += `\n${indentStr(`${prop}: ${toCssValue(value)};`, indent)}`
        }
      }
    }
  }

  for (const prop in style) {
    const value = style[prop]
    if (value != null && prop !== 'fallbacks') {
      result += `\n${indentStr(`${prop}: ${toCssValue(value)};`, indent)}`
    }
  }

  if (!result) return result

  indent--
  result = indentStr(`${selector} {${result}\n`, indent) + indentStr('}', indent)

  return result
}
