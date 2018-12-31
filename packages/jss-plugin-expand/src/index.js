// @flow
/* eslint-disable no-use-before-define */
import type {Plugin, StyleRule} from 'jss'
import {propArray, propArrayInObj, propObj, customPropObj} from './props'

/**
 * Map values by given prop.
 *
 * @param {Array} array of values
 * @param {String} original property
 * @param {String} original rule
 * @return {String} mapped values
 */
function mapValuesByProp(value, prop, rule: StyleRule) {
  return value.map(item => objectToArray(item, prop, rule, false, true))
}

/**
 * Convert array to nested array, if needed
 *
 * @param {Array} array of values
 * @param {String} original property
 * @param {Object} sheme, for converting arrays in strings
 * @param {Object} original rule
 * @return {String} converted string
 */
function processArray(value, prop, scheme, rule: StyleRule) {
  if (scheme[prop] == null) return value
  if (value.length === 0) return []
  if (Array.isArray(value[0])) return processArray(value[0], prop, scheme, rule)
  if (typeof value[0] === 'object') {
    return mapValuesByProp(value, prop, rule)
  }

  return [value]
}

/**
 * Convert object to array.
 *
 * @param {Object} object of values
 * @param {String} original property
 * @param {Object} original rule
 * @param {Boolean} is fallback prop
 * @param {Boolean} object is inside array
 * @return {String} converted string
 */
function objectToArray(value, prop, rule: StyleRule, isFallback, isInArray) {
  if (!(propObj[prop] || customPropObj[prop])) return []

  const result = []

  // Check if exists any non-standard property
  if (customPropObj[prop]) {
    // eslint-disable-next-line no-param-reassign
    value = customPropsToStyle(value, rule, customPropObj[prop], isFallback)
  }

  // Pass throught all standart props
  if (Object.keys(value).length) {
    for (const baseProp in propObj[prop]) {
      if (value[baseProp]) {
        if (Array.isArray(value[baseProp])) {
          result.push(
            propArrayInObj[baseProp] === null ? value[baseProp] : value[baseProp].join(' ')
          )
        } else result.push(value[baseProp])
        continue
      }

      // Add default value from props config.
      if (propObj[prop][baseProp] != null) {
        result.push(propObj[prop][baseProp])
      }
    }
  }

  if (!result.length || isInArray) return result
  return [result]
}

/**
 * Convert custom properties values to styles adding them to rule directly
 *
 * @param {Object} object of values
 * @param {Object} original rule
 * @param {String} property, that contain partial custom properties
 * @param {Boolean} is fallback prop
 * @return {Object} value without custom properties, that was already added to rule
 */
function customPropsToStyle(value, rule: StyleRule, customProps, isFallback) {
  for (const prop in customProps) {
    const propName = customProps[prop]

    // If current property doesn't exist already in rule - add new one
    if (typeof value[prop] !== 'undefined' && (isFallback || !rule.prop(propName))) {
      const appendedValue = styleDetector(
        {
          [propName]: value[prop]
        },
        rule
      )[propName]

      // Add style directly in rule
      if (isFallback) rule.style.fallbacks[propName] = appendedValue
      else rule.style[propName] = appendedValue
    }
    // Delete converted property to avoid double converting
    delete value[prop]
  }

  return value
}

/**
 * Detect if a style needs to be converted.
 *
 * @param {Object} style
 * @param {Object} rule
 * @param {Boolean} is fallback prop
 * @return {Object} convertedStyle
 */
function styleDetector(style, rule: StyleRule, isFallback) {
  for (const prop in style) {
    const value = style[prop]

    if (Array.isArray(value)) {
      // Check double arrays to avoid recursion.
      if (!Array.isArray(value[0])) {
        if (prop === 'fallbacks') {
          // $FlowFixMe: Flow has problems with knowing that the fallback prop actually exists
          for (let index = 0; index < style.fallbacks.length; index++) {
            // $FlowFixMe: Flow has problems with knowing that the fallback prop actually exists
            style.fallbacks[index] = styleDetector(style.fallbacks[index], rule, true)
          }
          continue
        }

        style[prop] = processArray(value, prop, propArray, rule)
        // Avoid creating properties with empty values
        if (!style[prop].length) delete style[prop]
      }
    } else if (typeof value === 'object') {
      if (prop === 'fallbacks') {
        // $FlowFixMe: Flow has problems with knowing that the fallback prop actually exists
        style.fallbacks = styleDetector(style.fallbacks, rule, true)
        continue
      }

      style[prop] = objectToArray(value, prop, rule, isFallback)
      // Avoid creating properties with empty values
      if (!style[prop].length) delete style[prop]
    }

    // Maybe a computed value resulting in an empty string
    else if (style[prop] === '') delete style[prop]
  }

  return style
}

/**
 * Adds possibility to write expanded styles.
 *
 * @param {Rule} rule
 * @api public
 */
export default function jssExpand(): Plugin {
  function onProcessStyle(style, rule) {
    if (!style || rule.type !== 'style') return style

    if (Array.isArray(style)) {
      // Pass rules one by one and reformat them
      for (let index = 0; index < style.length; index++) {
        style[index] = styleDetector(style[index], ((rule: any): StyleRule))
      }
      return style
    }

    return styleDetector(style, ((rule: any): StyleRule))
  }

  return {onProcessStyle}
}
