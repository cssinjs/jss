'use strict';

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _StyleSheet = require('./StyleSheet');

var _StyleSheet2 = _interopRequireDefault(_StyleSheet);

var _Rule = require('./Rule');

var _Rule2 = _interopRequireDefault(_Rule);

var _PluginsRegistry = require('./PluginsRegistry');

var _PluginsRegistry2 = _interopRequireDefault(_PluginsRegistry);

var _uid = require('./uid');

var uid = _interopRequireWildcard(_uid);

/**
 * Main Jss class.
 *
 * @api public
 */

var Jss = (function () {
  function Jss() {
    _classCallCheck(this, Jss);

    this.plugins = new _PluginsRegistry2['default']();
    this.Jss = Jss;
    this.StyleSheet = _StyleSheet2['default'];
    this.Rule = _Rule2['default'];
    this.uid = uid;
  }

  /**
   * Creates a new instance of Jss.
   *
   * @see Jss
   * @api public
   */

  Jss.prototype.create = function create() {
    return new Jss();
  };

  /**
   * Create a stylesheet.
   *
   * @see StyleSheet
   * @api public
   */

  Jss.prototype.createStyleSheet = function createStyleSheet(rules) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    options.jss = this;
    return new _StyleSheet2['default'](rules, options);
  };

  /**
   * Create a rule.
   *
   * @see Rule
   * @return {Rule}
   * @api public
   */

  Jss.prototype.createRule = function createRule(selector, style, options) {
    if (typeof selector == 'object') {
      options = style;
      style = selector;
      selector = null;
    }
    if (!options) options = {};
    options.jss = this;
    var rule = new _Rule2['default'](selector, style, options);
    this.plugins.run(rule);
    return rule;
  };

  /**
   * Register plugin. Passed function will be invoked with a rule instance.
   *
   * @param {Function} fn
   * @api public
   */

  Jss.prototype.use = function use(fn) {
    this.plugins.use(fn);
    return this;
  };

  return Jss;
})();

exports['default'] = Jss;
module.exports = exports['default'];