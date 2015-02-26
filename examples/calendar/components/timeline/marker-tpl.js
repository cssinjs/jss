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
