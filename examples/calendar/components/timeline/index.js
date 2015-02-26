'use strict'

var jss = require('../jss')
var utils = require('../utils')
var markerTpl = require('./marker-tpl')

var sheet = jss.createStyleSheet(require('./styles'))

/**
 * Creates a timeline view.
 */
function Timeline(options) {
    this.element = null
    this.start = options.start
    this.end = options.end
}

module.exports = Timeline

/**
 * Creates timeline elements.
 *
 * @return {Timeline}
 */
Timeline.prototype.create = function () {
    sheet.attach()
    this.element = utils.element('div', {
        class: sheet.classes.timeline
    })

    var fragment = document.createDocumentFragment()
    for (var min = this.start; min < this.end; min += 30) {
        fragment.appendChild(this.createMarker({
            suffix: getSuffix(min),
            time: formatTime(min),
            min: min
        }))
    }
    this.element.appendChild(fragment)

    return this
}

/**
 * Create time marker element.
 *
 * @param {Obejct} options
 * @return {Element}
 */
Timeline.prototype.createMarker = function(options) {
    var element = utils.element('div', {
        class: sheet.classes.timeContainer
    })
    element.style.top = utils.minToY(options.min - this.start) + 'px'
    element.innerHTML = markerTpl.compile({
        time: options.time,
        classes: sheet.classes,
        suffix: options.suffix
    })

    return element
}

/**
 * Get PM/AM suffix.
 *
 * @param {Number} min
 * @return {String}
 */
function getSuffix(min) {
    var h = min / 60
    if (!isInt(h)) return false
    if (h < 12) return 'AM'
    return 'PM'
}

/**
 * Returns true if integer.
 *
 * @param {Number} n
 * @return {Boolean}
 */
function isInt(n) {
   return n % 1 === 0
}

/**
 * Format time according the layout.
 *
 * @param {Number} min
 * @return {String}
 */
function formatTime(min) {
    var h = min / 60
    if (h > 12.5) h -= 12

    return isInt(h) ? h + ':00' : Math.floor(h) + ':30'
}
