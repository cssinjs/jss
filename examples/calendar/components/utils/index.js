import conf from '../conf'

/**
 * Create DOM node, set attributes.
 *
 * @param {String} name
 * @param {Object} [attrs]
 * @return Element
 */
export function createElement(name, attrs) {
  const element = document.createElement(name)

  for (const attr in attrs) {
    element.setAttribute(attr, attrs[attr])
  }

  return element
}

const MIN_IN_DAY = 12 * 60

/**
 * Converts minutes to Y offset in px.
 *
 * @param {Number} min
 * @return {Number}
 */
export function minToY(min) {
  return (conf.height * min) / MIN_IN_DAY
}
