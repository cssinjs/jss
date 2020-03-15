import jss from '../jss'
import * as utils from '../utils'
import * as markerTpl from './marker-tpl'
import {rules} from './style'

const sheet = jss.createStyleSheet(rules)

/**
 * Returns true if integer.
 *
 * @param {Number} n
 * @return {Boolean}
 */
function isInt(n) {
  return n % 1 === 0
}

/**
 * Get PM/AM suffix.
 *
 * @param {Number} min
 * @return {String}
 */
function getSuffix(min) {
  const h = min / 60
  if (!isInt(h)) return false
  if (h < 12) return 'AM'
  return 'PM'
}

/**
 * Format time according the layout.
 *
 * @param {Number} min
 * @return {String}
 */
function formatTime(min) {
  let h = min / 60
  if (h > 12.5) h -= 12
  return isInt(h) ? `${h}:00` : `${Math.floor(h)}:30`
}

export default class Timeline {
  /**
   * Creates a timeline view.
   */
  constructor(options) {
    this.element = null
    this.start = options.start
    this.end = options.end
  }

  /**
   * Creates timeline elements.
   *
   * @return {Timeline}
   */
  create() {
    sheet.attach()
    this.element = utils.createElement('div', {
      class: sheet.classes.timeline
    })

    const fragment = document.createDocumentFragment()
    for (let min = this.start; min < this.end; min += 30) {
      fragment.appendChild(
        this.createMarker({
          suffix: getSuffix(min),
          time: formatTime(min),
          min
        })
      )
    }
    this.element.appendChild(fragment)
    return this
  }

  /**
   * Create time marker element.
   *
   * @param {Obejct} options
   * @return {Element}
   */
  createMarker(options) {
    const element = utils.createElement('div', {
      class: sheet.classes.timeContainer
    })
    element.style.top = `${utils.minToY(options.min - this.start)}px`
    element.innerHTML = markerTpl.compile({
      time: options.time,
      classes: sheet.classes,
      suffix: options.suffix
    })
    return element
  }
}
