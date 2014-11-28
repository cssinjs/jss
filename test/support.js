'use strict'

QUnit.module('CSS feature test')

test('known property', function () {
    var prop = jss.support.getProp('animation')
    var prefixedProp = jss.vendorPrefix.css + 'animation'

    equal(prop, prefixedProp)
})

test('unknown property', function () {
    equal(jss.support.getProp('xxx'), false)
})

