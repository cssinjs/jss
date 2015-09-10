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
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var StyleSheet = (function () {
  _createClass(StyleSheet, null, [{
    key: 'ATTRIBUTES',
    value: ['title', 'type', 'media'],
    enumerable: true
  }]);

  function StyleSheet(rules) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, StyleSheet);

    if (options.named == null) options.named = true;
    this.options = options;
    this.element = null;
    this.attached = false;
    this.media = options.media;
    this.type = options.type;
    this.title = options.title;
    this.rules = {};
    // Only when options.named: true.
    this.classes = {};
    this.deployed = false;
    this.linked = false;
    this.jss = this.options.jss;

    // Don't create element if we are not in a browser environment.
    if (typeof document != 'undefined') {
      this.element = this.createElement();
    }

    for (var key in rules) {
      this.createRules(key, rules[key]);
    }
  }

  /**
   * Insert stylesheet element to render tree.
   *
   * @api public
   * @return {StyleSheet}
   */

  StyleSheet.prototype.attach = function attach() {
    if (this.attached) return this;
    if (!this.deployed) {
      this.deploy();
      this.deployed = true;
    }

    document.head.appendChild(this.element);

    // Before element is attached to the dom rules are not created.
    if (!this.linked && this.options.link) {
      this.link();
      this.linked = true;
    }
    this.attached = true;
    return this;
  };

  /**
   * Remove stylesheet element from render tree.
   *
   * @return {StyleSheet}
   * @api public
   */

  StyleSheet.prototype.detach = function detach() {
    if (!this.attached) return this;
    this.element.parentNode.removeChild(this.element);
    this.attached = false;
    return this;
  };

  /**
   * Deploy styles to the element.
   *
   * @return {StyleSheet}
   * @api private
   */

  StyleSheet.prototype.deploy = function deploy() {
    this.element.innerHTML = '\n' + this.toString() + '\n';
    return this;
  };

  /**
   * Find CSSRule objects in the DOM and link them in the corresponding Rule instance.
   *
   * @return {StyleSheet}
   * @api private
   */

  StyleSheet.prototype.link = function link() {
    var CSSRuleList = this.element.sheet.cssRules;
    var rules = this.rules;

    for (var i = 0; i < CSSRuleList.length; i++) {
      var CSSRule = CSSRuleList[i];
      var rule = rules[CSSRule.selectorText];
      if (rule) rule.CSSRule = CSSRule;
    }
    return this;
  };

  /**
   * Add a rule to the current stylesheet. Will insert a rule also after the stylesheet
   * has been rendered first time.
   *
   * @param {Object} [key] can be selector or name if `options.named` is true
   * @param {Object} style property/value hash
   * @return {Rule}
   * @api public
   */

  StyleSheet.prototype.addRule = function addRule(key, style) {
    var rules = this.createRules(key, style);

    // Don't insert rule directly if there is no stringified version yet.
    // It will be inserted all together when .attach is called.
    if (this.deployed) {
      var sheet = this.element.sheet;

      for (var i = 0; i < rules.length; i++) {
        var nextIndex = sheet.cssRules.length;
        var rule = rules[i];
        sheet.insertRule(rule.toString(), nextIndex);
        if (this.options.link) rule.CSSRule = sheet.cssRules[nextIndex];
      }
    } else this.deploy();
    return rules;
  };

  /**
   * Create rules, will render also after stylesheet was rendered the first time.
   *
   * @param {Object} rules key:style hash.
   * @return {Array} array of added rules
   * @api public
   */

  StyleSheet.prototype.addRules = function addRules(rules) {
    var added = [];
    for (var key in rules) {
      added.push.apply(added, this.addRule(key, rules[key]));
    }
    return added;
  };

  /**
   * Get a rule.
   *
   * @param {String} key can be selector or name if `named` is true.
   * @return {Rule}
   * @api public
   */

  StyleSheet.prototype.getRule = function getRule(key) {
    return this.rules[key];
  };

  /**
   * Convert rules to a css string.
   *
   * @return {String}
   * @api public
   */

  StyleSheet.prototype.toString = function toString() {
    var str = '';
    var rules = this.rules;

    var stringified = {};
    for (var key in rules) {
      var rule = rules[key];
      // We have the same rule referenced twice if using named urles.
      // By name and by selector.
      if (stringified[rule.id]) continue;
      if (str) str += '\n';
      str += rules[key].toString();
      stringified[rule.id] = true;
    }
    return str;
  };

  /**
   * Create a rule, will not render after stylesheet was rendered the first time.
   *
   * @param {Object} [selector] if you don't pass selector - it will be generated
   * @param {Object} [style] declarations block
   * @param {Object} [options] rule options
   * @return {Array} rule can contain child rules
   * @api private
   */

  StyleSheet.prototype.createRules = function createRules(key, style) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var rules = [];
    var named = this.options.named;

    // Scope options overwrite instance options.
    if (options.named != null) named = options.named;

    var rule = this.jss.createRule(key, style, {
      sheet: this,
      named: named
    });
    rules.push(rule);

    this.rules[rule.selector] = rule;
    if (named && !rule.isAtRule) {
      this.rules[key] = rule;
      this.classes[key] = rule.className;
    }

    for (key in rule.children) {
      rules.push(this.createRules(key, rule.children[key].style, rule.children[key].options));
    }
    return rules;
  };

  /**
   * Create style sheet element.
   *
   * @return {Element}
   * @api private
   */

  StyleSheet.prototype.createElement = function createElement() {
    var _this = this;

    var element = document.createElement('style');
    StyleSheet.ATTRIBUTES.forEach(function (name) {
      if (_this[name]) element.setAttribute(name, _this[name]);
    });
    return element;
  };

  return StyleSheet;
})();

exports['default'] = StyleSheet;
module.exports = exports['default'];