'use strict'

var conf = require('../conf')

module.exports = {
    container: {
        'font-size': conf.fontSize + 'px',
        color: '#686868',
        width: conf.timeline.width + conf.canvas.width + 'px'
    }
}
