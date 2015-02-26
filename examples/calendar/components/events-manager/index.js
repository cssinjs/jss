'use strict'

var Event = require('../event')
var distribute = require('./distribute')

/**
 * Handles events creation and distribution.
 */
function EventsManager(canvas) {
    this.canvas = canvas
    this.events = []
}

module.exports = EventsManager

/**
 * Destroy previously rendered events.
 *
 * @return {EventsManager}
 */
EventsManager.prototype.destroy = function () {
    this.events.forEach(function (event) {
        event.destroy()
    })

    return this
}

/**
 * Render events at the right position and the right size.
 *
 * @param {Array} events
 * @return {EventsManager}
 */
EventsManager.prototype.set = function (events) {
    this.events = events.map(function (options) {
        return new Event(options)
    })

    return this
}

/**
 * Render events at the right position and the right size.
 *
 * @return {EventsManager}
 */
EventsManager.prototype.render = function () {
    distribute(this.events, this.canvas).forEach(function (event) {
        event.create()
        this.canvas.add(event)
    }, this)

    return this
}

