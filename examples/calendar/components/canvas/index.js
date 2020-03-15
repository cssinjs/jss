import jss from '../jss'
import * as utils from '../utils'
import style from './style'

const sheet = jss.createStyleSheet(style)

export default class Canvas {
  /**
   * Canvas is a container view events can be added to.
   */
  constructor() {
    this.element = null
    this.contentElement = null
  }

  /**
   * Create canvas elements.
   *
   * @return {Canvas}
   */
  create() {
    sheet.attach()
    this.element = utils.createElement('div', {
      class: sheet.classes.canvas
    })
    this.contentElement = utils.createElement('div', {
      class: sheet.classes.content
    })
    this.element.appendChild(this.contentElement)
    return this
  }

  /**
   * Add event.
   *
   * @param {Event} event
   * @return {Canvas}
   */
  add(event) {
    this.contentElement.appendChild(event.element)
    return this
  }

  /**
   * Get content width.
   *
   * @return {Number}
   */
  getContentWidth() {
    return this.contentElement.offsetWidth
  }
}
