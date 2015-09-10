'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _uid = require('./uid');

var uid = _interopRequireWildcard(_uid);

var _clone = require('./clone');

var _clone2 = _interopRequireDefault(_clone);

var _defaults = require('./defaults');

var _defaults2 = _interopRequireDefault(_defaults);

/**
 * Rule is selector + style hash.
 *
 * @param {String} [selector] can be selector, rule name, @media etc.
 * @param {Object} [style] declarations block
 * @param {Object} [options]
 * @api public
 */

var Rule = (function () {
  _createClass(Rule, null, [{
    key: 'NAMESPACE_PREFIX',

    /**
     * Class name prefix when generated.
     *
     * @type {String}
     * @api private
     */
    value: 'jss',

    /**
     * Indentation string for formatting toString output.
     *
     * @type {String}
     * @api private
     */
    enumerable: true
  }, {
    key: 'INDENTATION',
    value: '  ',
    enumerable: true
  }]);

  function Rule(selector, style) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, Rule);

    if (options.named == null) options.named = true;
    this.id = uid.get();
    this.options = options;
    this.isAtRule = (selector || '')[0] === '@';

    if (options.named) {
      if (this.isAtRule) {
        this.selector = selector;
      } else {
        this.className = Rule.NAMESPACE_PREFIX + '-' + this.id;
        this.selector = '.' + this.className;
      }
    } else this.selector = selector;

    // We expect style to be plain object.
    if (style) this.style = _clone2['default'](style);

    // Will be set by StyleSheet#link if link option is true.
    this.CSSRule = null;
    // When at-rule has sub rules.
    this.subrules = null;
    this.jss = this.options.jss;
    this.extractSubrules();
  }

  /**
   * Indent a string.
   *
   * http://jsperf.com/array-join-vs-for
   *
   * @param {Number} level
   * @param {String} str
   * @return {String}
   */

  /**
   * Get or set a style property.
   *
   * @param {String} name
   * @param {String|Number} [value]
   * @return {Rule|String|Number}
   * @api public
   */

  Rule.prototype.prop = function prop(name, value) {
    // Its a setter.
    if (value != null) {
      if (!this.style) this.style = {};
      this.style[name] = value;
      // If linked option in StyleSheet is not passed, CSSRule is not defined.
      if (this.CSSRule) this.CSSRule.style[name] = value;
      return this;
    }

    // Its a getter.
    if (this.style) value = this.style[name];

    // Read the value from the DOM if its not cached.
    if (value == null && this.CSSRule) {
      value = this.CSSRule.style[name];
      // Cache the value after we have got it from the DOM once.
      this.style[name] = value;
    }
    return value;
  };

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

  Rule.prototype.addChild = function addChild(selector, style, options) {
    if (!this.children) this.children = {};
    this.children[selector] = { style: style, options: options };
    return this;
  };

  /**
   * Extract @ rules into separate rules.
   *
   * @return {Rule}
   * @api private
   */

  Rule.prototype.extractSubrules = function extractSubrules() {
    if (!this.isAtRule || !this.style) return;
    if (!this.subrules) this.subrules = {};
    var sheet = this.options.sheet;
    for (var _name in this.style) {
      var options = this.options;
      var style = this.style[_name];
      // Not a nested rule.
      if (typeof style == 'string') break;
      var selector = undefined;
      // We are going to overwrite some rule within the same sheet when
      // @media query matches conditions.
      if (options.named) {
        var prevRule = sheet && sheet.rules[_name];
        if (prevRule) {
          selector = prevRule.selector;
          options = _defaults2['default']({ named: false }, options);
        }
      } else selector = _name;
      this.subrules[_name] = this.jss.createRule(selector, style, options);
      delete this.style[_name];
    }
  };

  /**
   * Apply rule to an element inline.
   *
   * @param {Element} element
   * @return {Rule}
   * @api public
   */

  Rule.prototype.applyTo = function applyTo(element) {
    for (var prop in this.style) {
      var value = this.style[prop];
      if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++) {
          element.style[prop] = value[i];
        }
      } else element.style[prop] = value;
    }
    return this;
  };

  /**
   * Converts the rule to css string.
   *
   * @return {String}
   * @api public
   */

  Rule.prototype.toString = function toString() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var style = this.style;
    // At rules like @charset
    if (this.isAtRule && !this.style && !this.subrules) return this.selector + ';';
    if (options.indentationLevel == null) options.indentationLevel = 0;
    var str = indent(options.indentationLevel, this.selector + ' {');

    for (var prop in style) {
      var value = style[prop];
      // We want to generate multiple style with identical property names.
      if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++) {
          str += '\n' + indent(options.indentationLevel + 1, prop + ': ' + value[i] + ';');
        }
      } else {
        str += '\n' + indent(options.indentationLevel + 1, prop + ': ' + value + ';');
      }
    }

    // We have an at-rule with nested statements.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
    var toStringOptions = { indentationLevel: options.indentationLevel + 1 };
    for (var _name2 in this.subrules) {
      str += '\n' + indent(options.indentationLevel, this.subrules[_name2].toString(toStringOptions));
    }

    str += '\n' + indent(options.indentationLevel, '}');
    return str;
  };

  /**
   * Returns JSON representation of the rule.
   * Nested rules, at-rules and array values are not supported.
   *
   * @return {Object}
   * @api public
   */

  Rule.prototype.toJSON = function toJSON() {
    var style = {};
    for (var prop in this.style) {
      var value = this.style[prop];
      var type = typeof value;
      if (type === 'string' || type === 'number') {
        style[prop] = value;
      }
    }
    return style;
  };

  return Rule;
})();

exports['default'] = Rule;
function indent(level, str) {
  var indentStr = '';
  for (var i = 0; i < level; i++) {
    indentStr += Rule.INDENTATION;
  }return indentStr + str;
}
module.exports = exports['default'];