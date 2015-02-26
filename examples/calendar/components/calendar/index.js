'use strict'

var jss = require('../jss')
var utils = require('../utils')
var Canvas = require('../canvas')
var Timeline = require('../timeline')
var EventsManager = require('../events-manager')

var sheet = jss.createStyleSheet(require('./styles'))

/**
 * Creates a new calendar view.
 */
function Calendar(options) {
    this.timeline = new Timeline(options.timeline)
    this.canvas = new Canvas()
    this.manager = new EventsManager(this.canvas)
    this.element = null
}

module.exports = Calendar

/**
 * Renders layout.
 *
 * @return {Calendar}
 */
Calendar.prototype.create = function () {
    sheet.attach()
    this.element = utils.element('div', {
        class: sheet.classes.container
    })

    this.timeline.create()
    this.canvas.create()

    this.element.appendChild(this.timeline.element)
    this.element.appendChild(this.canvas.element)

    return this
}


/**
 * Render main container.
 *
 * @param {Array} events
 * @return {Calendar}
 */
Calendar.prototype.renderDay = function (events) {
    this.manager
        .destroy()
        .set(events)
        .render()

    return this
}
