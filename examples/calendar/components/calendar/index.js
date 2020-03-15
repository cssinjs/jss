import debounce from 'lodash/debounce'
import jss from '../jss'
import * as utils from '../utils'
import Canvas from '../canvas'
import Timeline from '../timeline'
import EventsManager from '../events-manager'
import style from './style'

const sheet = jss.createStyleSheet(style)

export default class Calendar {
  /**
   * Creates a new calendar view.
   */
  constructor(options) {
    this.timeline = new Timeline(options.timeline)
    this.canvas = new Canvas()
    this.manager = new EventsManager(this.canvas)
    this.element = null
    this.onResizeWindow = this.onResizeWindow.bind(this)
  }

  /**
   * Renders layout.
   *
   * @return {Calendar}
   */
  create() {
    sheet.attach()
    this.element = utils.createElement('div', {
      class: sheet.classes.calendar
    })
    this.timeline.create()
    this.canvas.create()
    this.element.appendChild(this.timeline.element)
    this.element.appendChild(this.canvas.element)
    window.addEventListener('resize', debounce(this.onResizeWindow, 50))
    return this
  }

  /**
   * Render main container.
   *
   * @param {Array} events
   * @return {Calendar}
   */
  renderDay(events) {
    this.manager
      .destroy()
      .set(events)
      .render()
    return this
  }

  onResizeWindow() {
    this.manager.destroy().render()
  }
}
