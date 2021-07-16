const join = (value, by) => {
  let result = ''
  for (let i = 0; i < value.length; i++) {
    // Remove !important from the value, it will be readded later.
    if (value[i] === '!important') break
    if (result) result += by
    result += value[i]
  }
  return result
}

/**
 * Converts JSS array value to a CSS string.
 *
 * `margin: [['5px', '10px']]` > `margin: 5px 10px;`
 * `border: ['1px', '2px']` > `border: 1px, 2px;`
 * `margin: [['5px', '10px'], '!important']` > `margin: 5px 10px !important;`
 * `color: ['red', !important]` > `color: red !important;`
 */
const toCssValue = (value, ignoreImportant = false) => {
  if (!Array.isArray(value)) return value

  let cssValue = ''

  // Support space separated values via `[['5px', '10px']]`.
  if (Array.isArray(value[0])) {
    for (let i = 0; i < value.length; i++) {
      if (value[i] === '!important') break
      if (cssValue) cssValue += ', '
      cssValue += join(value[i], ' ')
    }
  } else cssValue = join(value, ', ')

  // Add !important, because it was ignored.
  if (!ignoreImportant && value[value.length - 1] === '!important') {
    cssValue += ' !important'
  }

  return cssValue
}

export default toCssValue
