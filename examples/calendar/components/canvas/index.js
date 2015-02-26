'use strict'

var jss = require('../jss')
var utils = require('../utils')
var styles = require('./styles')

var sheet = jss.createStyleSheet(styles.rules)

/**
 * Canvas is a container view events can be added to.
 */
function Canvas() {
    this.element = null
    this.contentElement = null
}

module.exports = Canvas

/**
 * Create canvas elements.
 *
 * @return {Canvas}
 */
Canvas.prototype.create = function () {
    sheet.attach()

    this.element = utils.element('div', {
        class: sheet.classes.canvas
    })
    this.contentElement = utils.element('div', {
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
Canvas.prototype.add = function (event) {
    this.contentElement.appendChild(event.element)

    return this
}

/**
 * Get content width.
 *
 * @return {Number}
 */
Canvas.prototype.getContentWidth = function () {
    return styles.contentWidth;
}
