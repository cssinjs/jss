// @flow
import type {Plugin} from 'jss'
import hyphenate from 'hyphenate-style-name'

/**
 * Convert camel cased property names to dash separated.
 *
 * @param {Object} style
 * @return {Object}
 */
function convertCase(style) {
  const converted = {}

  for (const prop in style) {
    converted[hyphenate(prop)] = style[prop]
  }

  if (style.fallbacks) {
    if (Array.isArray(style.fallbacks)) converted.fallbacks = style.fallbacks.map(convertCase)
    else converted.fallbacks = convertCase(style.fallbacks)
  }

  return converted
}

/**
 * Allow camel cased property names by converting them back to dasherized.
 *
 * @param {Rule} rule
 */
export default function camelCase(): Plugin {
  function onProcessStyle(style) {
    if (Array.isArray(style)) {
      // Handle rules like @font-face, which can have multiple styles in an array
      for (let index = 0; index < style.length; index++) {
        style[index] = convertCase(style[index])
      }
      return style
    }

    return convertCase(style)
  }

  function onChangeValue(value, prop, rule) {
    const hyphenatedProp = hyphenate(prop)

    // There was no camel case in place
    if (prop === hyphenatedProp) return value

    rule.prop(hyphenatedProp, value)

    // Core will ignore that property value we set the proper one above.
    return null
  }

  return {onProcessStyle, onChangeValue}
}
