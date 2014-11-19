'use strict'

test('finding css vendor prefix', function () {
    equal(typeof jss.vendorPrefix.css, 'string', 'is string')
    equal(jss.vendorPrefix.css[0], '-', 'starts with dash')
    equal(jss.vendorPrefix.css[jss.vendorPrefix.css.length-1], '-', 'ends with dash')
    ok(jss.vendorPrefix.css.length >= 3, 'min length ok')
})

test('js vendor prefix is defined', function () {
    equal(typeof jss.vendorPrefix.js, 'string', 'is string')
})
