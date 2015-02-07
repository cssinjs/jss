'use strict'

var conf = require('../conf')

module.exports = {
    timeline: {
        position: 'relative',
        float: 'left',
        width: conf.timeline.width + 'px',
        height: conf.height + 'px',
        padding: '0 7px 0 0',
        'box-sizing': 'border-box',
        // Middle of the number should be the start.
        'margin-top': -conf.fontSize / 2 + 'px'
    },
    timeContainer: {
        position: 'absolute',
        width: '100%',
        'padding-right': '10px',
        'text-align': 'right',
        'box-sizing': 'border-box'
    },
    time: {
        'font-size': '10px',
        color: '#999'
    },
    timeWithSuffix: {
        'font-size': '13px',
        'font-weight': 'bold',
        'margin-right': '5px'
    },
    suffix: {
        'font-size': '10px',
        color: '#999'
    }
}
