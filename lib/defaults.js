/**
 * Merges second object with first one only if value is undefined.
 * It expects both objects to be plain.
 *
 * @param {Object} obj1
 * @param {Object} obj2
 * @return {Object} obj1
 */
"use strict";

exports.__esModule = true;
exports["default"] = defaults;

function defaults(obj1, obj2) {
  for (var key in obj2) {
    if (obj1[key] === undefined) obj1[key] = obj2[key];
  }
  return obj1;
}

module.exports = exports["default"];