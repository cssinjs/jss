/* @flow */
import createRule from '../utils/createRule'
import type {JssStyle, RuleOptions, Rule} from '../types'

const nlOrSemi = /\n|;/

// This is a very optimistic and simplified implementation.
// It is not intended to implement a full CSS parser here.
const toStyle = (cssText) => {
  const style = {}
  const split = cssText.trim().split(nlOrSemi)
  for (let i = 0; i < split.length; i++) {
    const item = split[i]
    if (!item) continue
    const colonIndex = item.indexOf(':')
    // Missing colon, must by a syntax error.
    // TODO warn.
    if (colonIndex === -1) continue
    const prop = item.substr(0, colonIndex).trim()
    const value = item.substr(colonIndex + 1).trim()
    style[prop] = value
  }
  return style
}

const onCreateRule = (key: string, cssText: string|JssStyle, options: RuleOptions): Rule|null => {
  if (typeof cssText !== 'string') return null
  const style = toStyle(cssText)
  return createRule(key, style, options)
}

export default {onCreateRule}
