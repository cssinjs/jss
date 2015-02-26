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
