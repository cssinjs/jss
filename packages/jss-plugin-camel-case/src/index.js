import hyphenate from 'hyphenate-style-name'

/**
 * Convert camel cased property names to dash separated.
 */
function convertCase(style) {
  const converted = {}

  for (const prop in style) {
    const key = prop.indexOf('--') === 0 ? prop : hyphenate(prop)

    converted[key] = style[prop]
  }

  if (style.fallbacks) {
    if (Array.isArray(style.fallbacks)) converted.fallbacks = style.fallbacks.map(convertCase)
    else converted.fallbacks = convertCase(style.fallbacks)
  }

  return converted
}

/**
 * Allow camel cased property names by converting them back to dasherized.
 */
export default function camelCase() {
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
    if (prop.indexOf('--') === 0) {
      return value
    }

    const hyphenatedProp = hyphenate(prop)

    // There was no camel case in place
    if (prop === hyphenatedProp) return value

    rule.prop(hyphenatedProp, value)

    // Core will ignore that property value we set the proper one above.
    return null
  }

  return {onProcessStyle, onChangeValue}
}
