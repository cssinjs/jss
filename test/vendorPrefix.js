'use strict'

test('finding vendor prefix', function () {
    equal(typeof jss.vendorPrefix, 'string', 'is string')
    equal(jss.vendorPrefix[0], '-', 'starts with dash')
    equal(jss.vendorPrefix[jss.vendorPrefix.length-1], '-', 'ends with dash')
    ok(jss.vendorPrefix.length >= 3, 'min length ok')
})
