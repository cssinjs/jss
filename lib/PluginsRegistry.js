"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PluginsRegistry = (function () {
  function PluginsRegistry() {
    _classCallCheck(this, PluginsRegistry);

    this.registry = [];
  }

  /**
   * Register plugin. Passed function will be invoked with a rule instance.
   *
   * @param {Function} fn
   * @api public
   */

  PluginsRegistry.prototype.use = function use(fn) {
    this.registry.push(fn);
  };

  /**
   * Execute all registered plugins.
   *
   * @param {Rule} rule
   * @api private
   */

  PluginsRegistry.prototype.run = function run(rule) {
    for (var i = 0; i < this.registry.length; i++) {
      this.registry[i](rule);
    }
  };

  return PluginsRegistry;
})();

exports["default"] = PluginsRegistry;
module.exports = exports["default"];