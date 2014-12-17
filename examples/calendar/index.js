'use strict'

var Calendar = require('./components/calendar')
var conf = require('./components/conf')

exports.Calendar = Calendar

exports.createCalendar = function () {
    return new Calendar(conf).create()
}
