!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.calendar=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../canvas":3,"../events-manager":10,"../jss":11,"../timeline":12,"../utils":15,"./styles":2}],2:[function(require,module,exports){
'use strict'

var conf = require('../conf')

module.exports = {
    container: {
        'font-size': conf.fontSize + 'px',
        color: '#686868',
        width: conf.timeline.width + conf.canvas.width + 'px'
    }
}

},{"../conf":5}],3:[function(require,module,exports){
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

},{"../jss":11,"../utils":15,"./styles":4}],4:[function(require,module,exports){
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

},{"../conf":5}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{"../jss":11,"../utils":15,"./content-tpl":6,"./styles":8}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"../utils":15}],10:[function(require,module,exports){
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


},{"../event":7,"./distribute":9}],11:[function(require,module,exports){
'use strict'

module.exports = require('../../..')

},{"../../..":17}],12:[function(require,module,exports){
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

},{"../jss":11,"../utils":15,"./marker-tpl":13,"./styles":14}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{"../conf":5}],15:[function(require,module,exports){
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

},{"../conf":5}],16:[function(require,module,exports){
'use strict'

var Calendar = require('./components/calendar')
var conf = require('./components/conf')

exports.Calendar = Calendar

exports.createCalendar = function () {
    return new Calendar(conf).create()
}

},{"./components/calendar":1,"./components/conf":5}],17:[function(require,module,exports){
/**
 * StyleSheets written in javascript.
 *
 * @copyright Oleg Slobodskoi 2014
 * @website https://github.com/jsstyles/jss
 * @license MIT
 */

module.exports = require('./lib/index')

},{"./lib/index":20}],18:[function(require,module,exports){
'use strict'

var plugins = require('./plugins')

var uid = 0

var toString = Object.prototype.toString

/**
 * Rule is selector + style hash.
 *
 * @param {String} [selector]
 * @param {Object} [style] declarations block
 * @param {Object} [options]
 * @api public
 */
function Rule(selector, style, options) {
    if (typeof selector == 'object') {
        options = style
        style = selector
        selector = null
    }

    this.id = Rule.uid++
    this.options = options || {}
    if (this.options.named == null) this.options.named = true

    if (selector) {
        this.selector = selector
        this.isAtRule = selector[0] == '@'
    } else {
        this.isAtRule = false
        this.className = Rule.NAMESPACE_PREFIX + '-' + this.id
        this.selector = '.' + this.className
    }

    this.style = style
    // Will be set by StyleSheet#link if link option is true.
    this.CSSRule = null
    // When at-rule has sub rules.
    this.rules = null
    if (this.isAtRule && this.style) this.extractAtRules()
}

module.exports = Rule

/**
 * Class name prefix when generated.
 *
 * @type {String}
 * @api private
 */
Rule.NAMESPACE_PREFIX = 'jss'

/**
 * Indentation string for formatting toString output.
 *
 * @type {String}
 * @api private
 */
Rule.INDENTATION = '  '

/**
 * Unique id, right now just a counter, because there is no need for better uid.
 *
 * @type {Number}
 * @api private
 */
Rule.uid = 0

/**
 * Get or set a style property.
 *
 * @param {String} name
 * @param {String|Number} [value]
 * @return {Rule|String|Number}
 * @api public
 */
Rule.prototype.prop = function (name, value) {
    // Its a setter.
    if (value) {
        if (!this.style) this.style = {}
        this.style[name] = value
        // If linked option in StyleSheet is not passed, CSSRule is not defined.
        if (this.CSSRule) this.CSSRule.style[name] = value
        return this
    }

    // Its a getter.
    if (this.style) value = this.style[name]

    // Read the value from the DOM if its not cached.
    if (value == null && this.CSSRule) {
        value = this.CSSRule.style[name]
        // Cache the value after we have got it from the DOM once.
        this.style[name] = value
    }

    return value
}

/**
 * Add child rule. Required for plugins like "nested".
 * StyleSheet will render them as a separate rule.
 *
 * @param {String} selector
 * @param {Object} style
 * @param {Object} [options] rule options
 * @return {Rule}
 * @api private
 */
Rule.prototype.addChild = function (selector, style, options) {
    if (!this.children) this.children = {}
    this.children[selector] = {
        style: style,
        options: options
    }

    return this
}

/**
 * Add child rule. Required for plugins like "nested".
 * StyleSheet will render them as a separate rule.
 *
 * @param {String} selector
 * @param {Object} style
 * @return {Rule}
 * @api public
 */
Rule.prototype.extractAtRules = function () {
    if (!this.rules) this.rules = {}

    for (var name in this.style) {
        var style = this.style[name]
        // Not a nested rule.
        if (typeof style == 'string') break
        var selector = this.options.named ? undefined : name
        var rule = this.rules[name] = new Rule(selector, style, this.options)
        plugins.run(rule)
        delete this.style[name]
    }

    return this
}

/**
 * Apply rule to an element inline.
 *
 * @param {Element} element
 * @return {Rule}
 * @api public
 */
Rule.prototype.applyTo = function (element) {
    for (var prop in this.style) {
        var value = this.style[prop]
        if (toString.call(value) == '[object Array]') {
            for (var i = 0; i < value.length; i++) {
                element.style[prop] = value[i]
            }
        } else {
            element.style[prop] = value
        }
    }

    return this
}

/**
 * Converts the rule to css string.
 *
 * @return {String}
 * @api public
 */
Rule.prototype.toString = function (options) {
    var style = this.style

    // At rules like @charset
    if (this.isAtRule && !this.style && !this.rules) return this.selector + ';'

    if (!options) options = {}
    if (options.indentationLevel == null) options.indentationLevel = 0

    var str = indent(options.indentationLevel, this.selector + ' {')

    for (var prop in style) {
        var value = style[prop]
        // We want to generate multiple style with identical property names.
        if (toString.call(value) == '[object Array]') {
            for (var i = 0; i < value.length; i++) {
                str += '\n' + indent(options.indentationLevel + 1, prop + ': ' + value[i] + ';')
            }
        } else {
            str += '\n' + indent(options.indentationLevel + 1, prop + ': ' + value + ';')
        }
    }

    // We are have an at-rule with nested statements.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
    for (var name in this.rules) {
        var ruleStr = this.rules[name].toString({
            indentationLevel: options.indentationLevel + 1
        })
        str += '\n' + indent(options.indentationLevel, ruleStr)
    }

    str += '\n' + indent(options.indentationLevel, '}')

    return str
}

/**
 * Returns JSON representation of the rule.
 * Nested rules, at-rules and array values are not supported.
 *
 * @return {Object}
 * @api public
 */
Rule.prototype.toJSON = function () {
    var style = {}

    for (var prop in this.style) {
        var value = this.style[prop]
        var type = typeof value
        if (type == 'string' || type == 'number') {
            style[prop] = value
        }
    }

    return style
}

/**
 * Indent a string.
 *
 * @param {Number} level
 * @param {String} str
 * @return {String}
 */
function indent(level, str) {
    var indentStr = ''
    for (var i = 0; i < level; i++) indentStr += Rule.INDENTATION
    return indentStr + str
}

},{"./plugins":21}],19:[function(require,module,exports){
'use strict'

var Rule = require('./Rule')
var plugins = require('./plugins')

/**
 * StyleSheet abstraction, contains rules, injects stylesheet into dom.
 *
 * Options:
 *
 *  - `media` style element attribute
 *  - `title` style element attribute
 *  - `type` style element attribute
 *  - `named` true by default - keys are names, selectors will be generated,
 *    if false - keys are global selectors.
 *  - `link` link jss Rule instances with DOM CSSRule instances so that styles,
 *  can be modified dynamically, false by default because it has some performance cost.
 *
 * @param {Object} [rules] object with selectors and declarations
 * @param {Object} [options]
 * @api public
 */
function StyleSheet(rules, options) {
    this.options = options || {}
    if (this.options.named == null) this.options.named = true
    this.element = null
    this.attached = false
    this.media = this.options.media
    this.type = this.options.type
    this.title = this.options.title
    this.rules = {}
    // Only when options.named: true.
    this.classes = {}
    this.deployed = false
    this.linked = false

    // Don't create element if we are not in a browser environment.
    if (typeof document != 'undefined') {
        this.element = this.createElement()
    }

    for (var key in rules) {
        this.createRules(key, rules[key])
    }
}

StyleSheet.ATTRIBUTES = ['title', 'type', 'media']

module.exports = StyleSheet

/**
 * Insert stylesheet element to render tree.
 *
 * @api public
 * @return {StyleSheet}
 */
StyleSheet.prototype.attach = function () {
    if (this.attached) return this

    if (!this.deployed) {
        this.deploy()
        this.deployed = true
    }

    document.head.appendChild(this.element)

    // Before element is attached to the dom rules are not created.
    if (!this.linked && this.options.link) {
        this.link()
        this.linked = true
    }

    this.attached = true

    return this
}

/**
 * Remove stylesheet element from render tree.
 *
 * @return {StyleSheet}
 * @api public
 */
StyleSheet.prototype.detach = function () {
    if (!this.attached) return this

    this.element.parentNode.removeChild(this.element)
    this.attached = false

    return this
}

/**
 * Deploy styles to the element.
 *
 * @return {StyleSheet}
 * @api private
 */
StyleSheet.prototype.deploy = function () {
    this.element.innerHTML = '\n' + this.toString() + '\n'

    return this
}

/**
 * Find CSSRule objects in the DOM and link them in the corresponding Rule instance.
 *
 * @return {StyleSheet}
 * @api private
 */
StyleSheet.prototype.link = function () {
    var CSSRuleList = this.element.sheet.cssRules
    var rules = this.rules

    for (var i = 0; i < CSSRuleList.length; i++) {
        var CSSRule = CSSRuleList[i]
        var rule = rules[CSSRule.selectorText]
        if (rule) rule.CSSRule = CSSRule
    }

    return this
}

/**
 * Add a rule to the current stylesheet. Will insert a rule also after the stylesheet
 * has been rendered first time.
 *
 * @param {Object} [key] can be selector or name if `options.named` is true
 * @param {Object} style property/value hash
 * @return {Rule}
 * @api public
 */
StyleSheet.prototype.addRule = function (key, style) {
    var rules = this.createRules(key, style)

    // Don't insert rule directly if there is no stringified version yet.
    // It will be inserted all together when .attach is called.
    if (this.deployed) {
        var sheet = this.element.sheet
        for (var i = 0; i < rules.length; i++) {
            var nextIndex = sheet.cssRules.length
            var rule = rules[i]
            sheet.insertRule(rule.toString(), nextIndex)
            if (this.options.link) rule.CSSRule = sheet.cssRules[nextIndex]
        }
    } else {
        this.deploy()
    }

    return rules
}

/**
 * Create rules, will render also after stylesheet was rendered the first time.
 *
 * @param {Object} rules key:style hash.
 * @return {StyleSheet} this
 * @api public
 */
StyleSheet.prototype.addRules = function (rules) {
    for (var key in rules) {
        this.addRule(key, rules[key])
    }

    return this
}

/**
 * Get a rule.
 *
 * @param {String} key can be selector or name if `named` is true.
 * @return {Rule}
 * @api public
 */
StyleSheet.prototype.getRule = function (key) {
    return this.rules[key]
}

/**
 * Convert rules to a css string.
 *
 * @return {String}
 * @api public
 */
StyleSheet.prototype.toString = function () {
    var str = ''
    var rules = this.rules
    var stringified = {}
    for (var key in rules) {
        var rule = rules[key]
        // We have the same rule referenced twice if using named urles.
        // By name and by selector.
        if (stringified[rule.id]) continue
        if (str) str += '\n'
        str += rules[key].toString()
        stringified[rule.id] = true
    }

    return str
}

/**
 * Create a rule, will not render after stylesheet was rendered the first time.
 *
 * @param {Object} [selector] if you don't pass selector - it will be generated
 * @param {Object} [style] declarations block
 * @param {Object} [options] rule options
 * @return {Array} rule can contain child rules
 * @api private
 */
StyleSheet.prototype.createRules = function (key, style, options) {
    var rules = []
    var selector, name

    if (!options) options = {}
    var named = this.options.named
    // Scope options overwrite instance options.
    if (options.named != null) named = options.named

    if (named) name = key
    else selector = key

    var rule = new Rule(selector, style, {
        sheet: this,
        named: named,
        name: name
    })
    rules.push(rule)

    this.rules[rule.selector] = rule
    if (name) {
        this.rules[name] = rule
        this.classes[name] = rule.className
    }

    plugins.run(rule)

    for (key in rule.children) {
        rules.push(this.createRules(
            key,
            rule.children[key].style,
            rule.children[key].options
        ))
    }

    return rules
}

/**
 * Create style sheet element.
 *
 * @api private
 * @return {Element}
 */
StyleSheet.prototype.createElement = function () {
    var element = document.createElement('style')

    StyleSheet.ATTRIBUTES.forEach(function (name) {
        if (this[name]) element.setAttribute(name, this[name])
    }, this)

    return element
}

},{"./Rule":18,"./plugins":21}],20:[function(require,module,exports){
'use strict'

var StyleSheet = require('./StyleSheet')
var Rule = require('./Rule')

exports.StyleSheet = StyleSheet

exports.Rule = Rule

exports.plugins = require('./plugins')

/**
 * Create a stylesheet.
 *
 * @param {Object} rules is selector:style hash.
 * @param {Object} [named] rules have names if true, class names will be generated.
 * @param {Object} [attributes] stylesheet element attributes.
 * @return {StyleSheet}
 * @api public
 */
exports.createStyleSheet = function (rules, named, attributes) {
    return new StyleSheet(rules, named, attributes)
}

/**
 * Create a rule.
 *
 * @param {String} [selector]
 * @param {Object} style is property:value hash.
 * @return {Rule}
 * @api public
 */
exports.createRule = function (selector, style) {
    var rule = new Rule(selector, style)
    exports.plugins.run(rule)
    return rule
}

/**
 * Register plugin. Passed function will be invoked with a rule instance.
 *
 * @param {Function} fn
 * @api public
 */
exports.use = exports.plugins.use

},{"./Rule":18,"./StyleSheet":19,"./plugins":21}],21:[function(require,module,exports){
'use strict'

/**
 * Registered plugins.
 *
 * @type {Array}
 * @api public
 */
exports.registry = []

/**
 * Register plugin. Passed function will be invoked with a rule instance.
 *
 * @param {Function} fn
 * @api public
 */
exports.use = function (fn) {
    exports.registry.push(fn)
}

/**
 * Execute all registered plugins.
 *
 * @param {Rule} rule
 * @api private
 */
exports.run = function (rule) {
    for (var i = 0; i < exports.registry.length; i++) {
        exports.registry[i](rule)
    }
}

},{}]},{},[16])(16)
});
