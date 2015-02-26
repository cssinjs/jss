'use strict'

var utils = require('../utils')

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
module.exports = function (events, canvas) {
    function setStyle(column, nr, columns) {
        var width = canvas.getContentWidth() / columns.length

        column.forEach(function (event) {
            var top = utils.minToY(event.start)
            var height = utils.minToY(event.end) - top

            event.setStyle({
                width: width + 'px',
                height: height + 'px',
                top: top + 'px',
                left: nr * width + 'px'
            })
        })
    }

    createGroups(events).forEach(function (group) {
        createColumns(group).forEach(setStyle)
    })

    return events
}

/**
 * Create groups of events which do not overlap. Events within this groups
 * will be rendered in columns if they overlap.
 *
 * @param {Array} events
 * @return {Array}
 */
function createGroups(events) {
    var groups = []
    var eventGroupMap = {}

    events.forEach(function createGroup(event) {
        var group = eventGroupMap[event.id]
        if (!group) {
            group = eventGroupMap[event.id] = [event]
            groups.push(group)
        }

        events.forEach(function addToGroup(_event) {
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
    var columns = []
    var eventStackMap = {}

    group.forEach(function createColumn(event) {
        var column = eventStackMap[event.id]
        if (!column) {
            column = eventStackMap[event.id] = [event]
            columns.push(column)
        }

        group.forEach(function addToColumn(_event) {
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
 * Check if 2 events collide in time.
 *
 * @param {Event} event1
 * @param {Event} event2
 * @return {Boolean}
 */
function collide(event1, event2) {
    var startInside = event1.start >= event2.start && event1.start <= event2.end
    var endInside = event1.end <= event2.end && event1.end > event2.start
    return startInside || endInside
}
