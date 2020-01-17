import Event from '../event'
import distribute from './distribute'

/**
 * Handles events creation and distribution.
 */
export default class EventsManager {
  constructor(canvas) {
    this.canvas = canvas
    this.events = []
  }

  /**
   * Destroy previously rendered events.
   *
   * @return {EventsManager}
   */
  destroy() {
    this.events.forEach(event => event.destroy())
    return this
  }

  /**
   * Render events at the right position and the right size.
   *
   * @param {Array} events
   * @return {EventsManager}
   */
  set(events) {
    this.events = events.map(options => new Event(options))
    return this
  }

  /**
   * Render events at the right position and the right size.
   *
   * @return {EventsManager}
   */
  render() {
    distribute(this.events, this.canvas).forEach(event => {
      event.create()
      this.canvas.add(event)
    })
    return this
  }
}
