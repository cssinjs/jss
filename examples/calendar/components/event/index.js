import jss from '../jss'
import * as utils from '../utils'
import * as contentTpl from './content-tpl'
import style from './style'

const sheet = jss.createStyleSheet(style)

let uid = 0

export default class Event {
  /**
   * Event view constructor.
   * @param {Object} options
   */
  constructor(options) {
    this.id = ++uid
    this.start = options.start
    this.end = options.end
    this.title = options.title || 'Sample Item'
    this.location = options.location || 'Sample Location'
    this.element = null
    this.style = null
  }

  /**
   * Create elements.
   *
   * @return {Event}
   */
  create() {
    sheet.attach()
    this.element = utils.createElement('div', {
      class: sheet.classes.event
    })
    this.element.innerHTML = contentTpl.compile({
      classes: sheet.classes,
      title: this.title,
      location: this.location
    })
    for (const key in this.style) {
      this.element.style[key] = this.style[key]
    }
    return this
  }

  /**
   * Destroy event.
   *
   * @return {Event}
   */
  destroy() {
    this.element.parentNode.removeChild(this.element)
    return this
  }

  /**
   * Set inline style.
   *
   * @return {Event}
   */
  setStyle(newStyle) {
    this.style = newStyle
    return this
  }
}
