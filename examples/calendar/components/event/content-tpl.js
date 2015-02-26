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
