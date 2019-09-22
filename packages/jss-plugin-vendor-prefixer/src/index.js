// @flow
import * as vendor from 'css-vendor'
import {toCssValue, type Plugin, type KeyframesRule} from 'jss'

/**
 * Add vendor prefix to a property name when needed.
 *
 * @api public
 */
export default function jssVendorPrefixer(): Plugin {
  function onProcessRule(rule) {
    if (rule.type === 'keyframes') {
      const atRule: KeyframesRule = (rule: any)
      atRule.at = vendor.supportedKeyframes(atRule.at)
    }
  }

  function prefixStyle(style) {
    for (const prop in style) {
      const value = style[prop]
      if (prop === 'fallbacks' && Array.isArray(value)) {
        style[prop] = value.map(prefixStyle)
        continue
      }
      let changeProp = false
      const supportedProp = vendor.supportedProperty(prop)
      if (supportedProp && supportedProp !== prop) changeProp = true

      let changeValue = false
      const supportedValue = vendor.supportedValue(supportedProp, toCssValue(value))
      if (supportedValue && supportedValue !== value) changeValue = true

      if (changeProp || changeValue) {
        if (changeProp) delete style[prop]
        style[supportedProp || prop] = supportedValue || value
      }
    }

    return style
  }

  function onProcessStyle(style, rule) {
    if (rule.type !== 'style') return style

    return prefixStyle(style)
  }

  function onChangeValue(value, prop) {
    return vendor.supportedValue(prop, toCssValue(value)) || value
  }

  return {onProcessRule, onProcessStyle, onChangeValue}
}
