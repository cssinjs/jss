'use strict'

QUnit.module('Extend plugin')

test('simple extend', function () {
    var a = {float: 'left'}
    var ss = new jss.Stylesheet({
        a: a,
        b: {
            extend: a,
            width: '1px'
        }
    })
    ok(ss.rules.a instanceof jss.Rule)
    ok(ss.rules.b instanceof jss.Rule)
    equal(ss.toString(), 'a {\n  float: left;\n}\nb {\n  float: left;\n  width: 1px;\n}')
})

test('multi extend', function () {
    var a = {float: 'left'}
    var b = {position: 'absolute'}
    var ss = new jss.Stylesheet({
        c: {
            extend: [a, b],
            width: '1px'
        }
    })
    ok(ss.rules.c instanceof jss.Rule)
    equal(ss.toString(), 'c {\n  float: left;\n  position: absolute;\n  width: 1px;\n}')
})

test('nested extend', function () {
    var c = {float: 'left'}
    var b = {extend: c, display: 'none'}
    var ss = new jss.Stylesheet({
        a: {
            extend: b,
            width: '1px'
        }
    })
    ok(ss.rules.a instanceof jss.Rule)
    equal(ss.toString(), 'a {\n  float: left;\n  display: none;\n  width: 1px;\n}')
})
