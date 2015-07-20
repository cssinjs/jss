!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.calendar=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.jss=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}]},{},[1])(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
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

},{"../canvas":4,"../events-manager":11,"../jss":12,"../timeline":13,"../utils":16,"./styles":3}],3:[function(require,module,exports){
'use strict'

var conf = require('../conf')

module.exports = {
    container: {
        'font-size': conf.fontSize + 'px',
        color: '#686868',
        width: conf.timeline.width + conf.canvas.width + 'px'
    }
}

},{"../conf":6}],4:[function(require,module,exports){
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

},{"../jss":12,"../utils":16,"./styles":5}],5:[function(require,module,exports){
'use strict'

var conf = require('../conf')

exports.width = conf.canvas.width
exports.height = conf.height
exports.padding = 10
exports.contentWidth = exports.width - exports.padding * 2

exports.rules = {
    canvas: {
        position: 'relative',
        float: 'left',
        width: exports.width + 'px',
        height: exports.height + 'px',
        background: '#ececec',
        'border-left': '1px solid #d5d5d5',
        'box-sizing': 'border-box'
    },
    content: {
        position: 'absolute',
        left: exports.padding + 'px',
        width: exports.contentWidth + 'px',
        height: exports.height + 'px'
    }
}

},{"../conf":6}],6:[function(require,module,exports){
'use strict'

/**
 * Configuration shared between all components.
 *
 * @type {Object}
 */
module.exports = {
    fontSize: 16,
    height: 720,
    timeline: {
        width: 75,
        start: 540,
        end: 1290
    },
    canvas: {
        width: 620,
        padding: 10
    }
}

},{}],7:[function(require,module,exports){
'use strict'

/**
 * Returns compiled html for event content.
 *
 * @param {Object} data
 * @return {String}
 */
exports.compile = function (data) {
    return '' +
        '<div class="' + data.classes.content + '">' +
            '<h3 class="' + data.classes.title + '">' + data.title + '</h3>' +
            '<div class="' + data.classes.location + '">' + data.location + '</div>' +
        '</div>'
}

},{}],8:[function(require,module,exports){
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

},{"../jss":12,"../utils":16,"./content-tpl":7,"./styles":9}],9:[function(require,module,exports){
'use strict'

module.exports = {
    container: {
        position: 'absolute',
        background: '#fff',
        'border-left': '4px solid #4b6ea8',
        'box-sizing': 'border-box'
    },
    content: {
        padding: '7px',
        overflow: 'hidden',
        height: '100%',
        border: '1px solid #d5d5d5',
        'border-left': 'none',
        'box-sizing': 'border-box'
    },
    title: {
        color: '#4b6ea8',
        margin: 0,
        'font-size': '1em'
    },
    location: {
        'font-size': '0.8em'
    }
}

},{}],10:[function(require,module,exports){
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

},{"../utils":16}],11:[function(require,module,exports){
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


},{"../event":8,"./distribute":10}],12:[function(require,module,exports){
'use strict'

module.exports = require('../../..')

},{"../../..":1}],13:[function(require,module,exports){
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

},{"../jss":12,"../utils":16,"./marker-tpl":14,"./styles":15}],14:[function(require,module,exports){
'use strict'

/**
 * Returns compiled template. Some template engine should be used in production
 * use case.
 *
 * @param {Object} data
 * @return {String}
 */
exports.compile = function (data) {
    var timeClass = data.classes[data.suffix ? 'timeWithSuffix' : 'time']
    var html = '<span class="' + timeClass + '">' + data.time + '</span>'
    if (data.suffix) {
        html += '<span class="' + data.classes.suffix + '">' + data.suffix + '</span>'
    }

    return html
}

},{}],15:[function(require,module,exports){
'use strict'

var conf = require('../conf')

module.exports = {
    timeline: {
        position: 'relative',
        float: 'left',
        width: conf.timeline.width + 'px',
        height: conf.height + 'px',
        padding: '0 7px 0 0',
        'box-sizing': 'border-box',
        // Middle of the number should be the start.
        'margin-top': -conf.fontSize / 2 + 'px'
    },
    timeContainer: {
        position: 'absolute',
        width: '100%',
        'padding-right': '10px',
        'text-align': 'right',
        'box-sizing': 'border-box'
    },
    time: {
        'font-size': '10px',
        color: '#999'
    },
    timeWithSuffix: {
        'font-size': '13px',
        'font-weight': 'bold',
        'margin-right': '5px'
    },
    suffix: {
        'font-size': '10px',
        color: '#999'
    }
}

},{"../conf":6}],16:[function(require,module,exports){
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

},{"../conf":6}],17:[function(require,module,exports){
'use strict'

var Calendar = require('./components/calendar')
var conf = require('./components/conf')

exports.Calendar = Calendar

exports.createCalendar = function () {
    return new Calendar(conf).create()
}

},{"./components/calendar":2,"./components/conf":6}]},{},[17])(17)
});