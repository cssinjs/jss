'use strict'

var conf = require('../conf')

/**
 * Create DOM node, set attributes.
 *
 * @param {String} name
 * @param {Object} [attrs]
 * @return Element
 */
exports.element = function (name, attrs) {
    var element = document.createElement(name)

    for (var name in attrs) {
        element.setAttribute(name, attrs[name])
    }

    return element
}

var MIN_IN_DAY = 12 * 60

/**
 * Converts minutes to Y offset in px.
 *
 * @param {Number} min
 * @return {Number}
 */
exports.minToY = function (min) {
    return conf.height * min / MIN_IN_DAY
}
