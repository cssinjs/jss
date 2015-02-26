'use strict'

var jss = require('../jss')
var utils = require('../utils')
var contentTpl = require('./content-tpl')

var sheet = jss.createStyleSheet(require('./styles'))

var uid = 0

/**
 * Event view constructor.
 * @param {Object} options
 */
function Event(options) {
    this.id = ++uid
    this.start = options.start
    this.end = options.end
    this.title = options.title || 'Sample Item'
    this.location = options.location || 'Sample Location'
    this.element = null
    this.style = null
}

module.exports = Event

/**
 * Create elements.
 *
 * @return {Event}
 */
Event.prototype.create = function () {
    sheet.attach()
    this.element = utils.element('div', {
        class: sheet.classes.container
    })
    this.element.innerHTML = contentTpl.compile({
        classes: sheet.classes,
        title: this.title,
        location: this.location
    })

    for (var key in this.style) {
        this.element.style[key] = this.style[key]
    }

    return this
}

/**
 * Destroy event.
 *
 * @return {Event}
 */
Event.prototype.destroy = function () {
    this.element.parentNode.removeChild(this.element)

    return this
}

/**
 * Set inline styles.
 *
 * @return {Event}
 */
Event.prototype.setStyle = function (style) {
    this.style = style

    return this
}
