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
