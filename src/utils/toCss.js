/* @flow */
import toCssValue from './toCssValue'
import type {ToCssOptions as Options} from '../types'

/**
 * Indent a string.
 * http://jsperf.com/array-join-vs-for
 */
function indent(level: number, str: string): string {
  let indentStr = ''
  for (let index = 0; index < level; index++) indentStr += '  '
  return indentStr + str
}

/**
 * Converts a Rule to CSS string.
 */
export default function toCss(selector: string, style: Object, options: Options = {}): string {
  let indentationLevel = options.indentationLevel || 0
  let str = ''

  const {fallbacks} = style

  if (options.selector !== false) indentationLevel++

  // Apply fallbacks first.
  if (fallbacks) {
    // Array syntax {fallbacks: [{prop: value}]}
    if (Array.isArray(fallbacks)) {
      for (let index = 0; index < fallbacks.length; index++) {
        const fallback = fallbacks[index]
        for (const prop in fallback) {
          const value = fallback[prop]
          if (value != null) {
            str += `\n${indent(indentationLevel, `${prop}: ${toCssValue(value)};`)}`
          }
        }
      }
    }
    // Object syntax {fallbacks: {prop: value}}
    else {
      for (const prop in fallbacks) {
        const value = fallbacks[prop]
        if (value != null) {
          str += `\n${indent(indentationLevel, `${prop}: ${toCssValue(value)};`)}`
        }
      }
    }
  }

  for (const prop in style) {
    const value = style[prop]
    if (value != null && prop !== 'fallbacks') {
      str += `\n${indent(indentationLevel, `${prop}: ${toCssValue(value)};`)}`
    }
  }

  if (!str) return str

  if (options.selector !== false) {
    indentationLevel--
    str = indent(indentationLevel, `${selector} {${str}\n`) + indent(indentationLevel, '}')
  }

  return str
}
