/* @flow */
const joinWithSpace = (value: Array<string|number>): string => value.join(' ')

/**
 * Converts array values to string.
 *
 * `margin: [['5px', '10px']]` > `margin: 5px 10px;`
 * `border: ['1px', '2px']` > `border: 1px, 2px;`
 * `margin: [['5px', '10px'], '!important']` > `margin: 5px 10px !important;`
 * `color: ['red', !important]` > `color: red !important;`
 */
export default function toCssValue(value: any, important: boolean = false) {
  if (!Array.isArray(value)) return value

  if (value[value.length - 1] === '!important') {
    important = true
    value = value.slice(0, value.length - 1)
  }

  // Support space separated values.
  if (Array.isArray(value[0])) {
    return toCssValue(value.map(joinWithSpace), important)
  }

  let cssValue = value.join(', ')
  if (important) cssValue += ' !important'

  return cssValue
}
