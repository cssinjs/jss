/* @flow */
const joinWithSpace = (value: Array<string|number>): string => value.join(' ')

/**
 * Converts array values to string.
 *
 * `margin: [['5px', '10px']]` > `margin: 5px 10px;`
 * `border: ['1px', '2px']` > `border: 1px, 2px;`
 */
export default function toCssValue(value: any) {
  if (!Array.isArray(value)) return value

  // Support space separated values.
  if (Array.isArray(value[0])) {
    return toCssValue(value.map(joinWithSpace))
  }

  return value.join(', ')
}
