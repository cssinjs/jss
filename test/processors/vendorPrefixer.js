'use strict'

QUnit.module('Vendor prefixes preprocessor')

test('known property', function () {
    var ss = new jss.Stylesheet({
        a: {transform: 'yyy'}
    })
    var prefixedProp = jss.vendorPrefix + 'transform'
    equal(ss.toString(), 'a {\n  ' + prefixedProp + ': yyy;\n}')
})

test('unknown property', function () {
    var ss = new jss.Stylesheet({
        a: {xxx: 'yyy'}
    })
    equal(ss.toString(), 'a {\n  xxx: yyy;\n}')
})

