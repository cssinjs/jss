// @flow
/* eslint-disable no-use-before-define */
import warning from 'tiny-warning'
import type {Plugin} from 'jss'

const isObject = obj => obj && typeof obj === 'object' && !Array.isArray(obj)
const valueNs = `extendCurrValue${Date.now()}`

function mergeExtend(style, rule, sheet, newStyle) {
  const extendType = typeof style.extend
  // Extend using a rule name.
  if (extendType === 'string') {
    if (!sheet) return
    const refRule = sheet.getRule(style.extend)
    if (!refRule) return
    if (refRule === rule) {
      warning(false, `[JSS] A rule tries to extend itself \n${rule.toString()}`)
      return
    }
    const {parent} = refRule.options
    if (parent) {
      const originalStyle = parent.rules.raw[style.extend]
      extend(originalStyle, rule, sheet, newStyle)
    }
    return
  }

  // Extend using an array.
  if (Array.isArray(style.extend)) {
    for (let index = 0; index < style.extend.length; index++) {
      const singleExtend = style.extend[index]
      const singleStyle =
        typeof singleExtend === 'string' ? {...style, extend: singleExtend} : style.extend[index]
      extend(singleStyle, rule, sheet, newStyle)
    }
    return
  }

  // Extend is a style object.
  for (const prop in style.extend) {
    if (prop === 'extend') {
      extend(style.extend.extend, rule, sheet, newStyle)
      continue
    }
    if (isObject(style.extend[prop])) {
      if (!(prop in newStyle)) newStyle[prop] = {}
      extend(style.extend[prop], rule, sheet, newStyle[prop])
      continue
    }
    newStyle[prop] = style.extend[prop]
  }
}

function mergeRest(style, rule, sheet, newStyle) {
  // Copy base style.
  for (const prop in style) {
    if (prop === 'extend') continue
    if (isObject(newStyle[prop]) && isObject(style[prop])) {
      extend(style[prop], rule, sheet, newStyle[prop])
      continue
    }

    if (isObject(style[prop])) {
      newStyle[prop] = extend(style[prop], rule, sheet)
      continue
    }

    newStyle[prop] = style[prop]
  }
}

/**
 * Recursively extend styles.
 */
function extend(style, rule, sheet, newStyle = {}) {
  mergeExtend(style, rule, sheet, newStyle)
  mergeRest(style, rule, sheet, newStyle)
  return newStyle
}

/**
 * Handle `extend` property.
 *
 * @param {Rule} rule
 * @api public
 */
export default function jssExtend(): Plugin {
  function onProcessStyle(style, rule, sheet) {
    if ('extend' in style) return extend(style, rule, sheet)
    return style
  }

  function onChangeValue(value, prop, rule) {
    if (prop !== 'extend') return value

    // Value is empty, remove properties set previously.
    if (value == null || value === false) {
      // $FlowFixMe[prop-missing]
      for (const key in rule[valueNs]) {
        rule.prop(key, null)
      }
      // $FlowFixMe[prop-missing] Flow complains because there is no indexer property in StyleRule
      rule[valueNs] = null
      return null
    }

    if (typeof value === 'object') {
      // $FlowFixMe[invalid-in-rhs] This will be an object
      for (const key in value) {
        // $FlowFixMe[incompatible-use] This will be an object
        rule.prop(key, value[key])
      }

      // $FlowFixMe[prop-missing] Flow complains because there is no indexer property in StyleRule
      rule[valueNs] = value
    }

    // Make sure we don't set the value in the core.
    return null
  }

  return {onProcessStyle, onChangeValue}
}
