import * as utils from '../utils'

/**
 * Check if 2 events collide in time.
 *
 * @param {Event} event1
 * @param {Event} event2
 * @return {Boolean}
 */
function collide(event1, event2) {
  const startInside = event1.start >= event2.start && event1.start <= event2.end
  const endInside = event1.end <= event2.end && event1.end > event2.start
  return startInside || endInside
}

/**
 * Create groups of events which do not overlap. Events within this groups
 * will be rendered in columns if they overlap.
 *
 * @param {Array} events
 * @return {Array}
 */
function createGroups(events) {
  const groups = []
  const eventGroupMap = {}

  events.forEach(event => {
    let group = eventGroupMap[event.id]
    if (!group) {
      group = eventGroupMap[event.id]
      group = [event]
      groups.push(group)
    }

    events.forEach(_event => {
      if (_event === event) return
      if (collide(event, _event)) {
        if (!eventGroupMap[_event.id]) {
          eventGroupMap[_event.id] = group
          group.push(_event)
        }
      }
    })
  })

  return groups
}

/**
 * Create columns within a group. To avoid visual overlap.
 *
 * @param {Array} events
 * @return {Array}
 */
function createColumns(group) {
  const columns = []
  const eventStackMap = {}

  group.forEach(event => {
    let column = eventStackMap[event.id]
    if (!column) {
      column = eventStackMap[event.id]
      column = [event]
      columns.push(column)
    }

    group.forEach(_event => {
      if (_event === event) return
      if (!collide(event, _event)) {
        if (!eventStackMap[_event.id]) {
          eventStackMap[_event.id] = column
          column.push(_event)
        }
      }
    })
  })

  return columns
}

/**
 * Distribute events within canvas.
 *
 * - No events may visually overlap.
 * - If two events collide in time, they MUST have the same width.
 *   This is an invariant. Call this width W.
 * - W should be the maximum value possible without breaking the previous invariant.
 *
 * @param {Array} events
 * @param {Canvas} canvas
 * @return {Array} events
 */
export default function distribute(events, canvas) {
  function setStyle(column, nr, columns) {
    const width = canvas.getContentWidth() / columns.length
    column.forEach(event => {
      const top = utils.minToY(event.start)
      const height = utils.minToY(event.end) - top
      event.setStyle({
        width: `${width}px`,
        height: `${height}px`,
        top: `${top}px`,
        left: `${nr * width}px`
      })
    })
  }

  createGroups(events).forEach(group => {
    createColumns(group).forEach(setStyle)
  })

  return events
}
