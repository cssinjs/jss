'use strict'

function PluginsRegistry() {
	this.registry = []
}

module.exports = PluginsRegistry

/**
 * Register plugin. Passed function will be invoked with a rule instance.
 *
 * @param {Function} fn
 * @api public
 */
PluginsRegistry.prototype.use = function (fn) {
    this.registry.push(fn)
}

/**
 * Execute all registered plugins.
 *
 * @param {Rule} rule
 * @api private
 */
PluginsRegistry.prototype.run = function (rule) {
    for (var i = 0; i < this.registry.length; i++) {
        this.registry[i](rule)
    }
}
