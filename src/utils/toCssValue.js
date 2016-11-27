const joinWithSpace = value => value.join(' ')

/**
 * Converts array values to string.
 *
 * `margin: [['5px', '10px']]` > `margin: 5px 10px;`
 * `border: ['1px', '2px']` > `border: 1px, 2px;`
 *
 * @param {Array} value
 * @return {String|Number|Object}
 */
export default function toCssValue(value) {
  if (!Array.isArray(value)) return value

  // Support space separated values.
  if (Array.isArray(value[0])) {
    return toCssValue(value.map(joinWithSpace))
  }

  return value.join(', ')
}
