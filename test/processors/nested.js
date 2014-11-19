'use strict'

QUnit.module('Nested preprocessor')

test('nesting with space', function () {
    var ss = new jss.Stylesheet({
        a: {
            float: 'left',
            '& b': {float: 'left'}
        }
    })
    ok(ss.rules.a instanceof jss.Rule)
    ok(ss.rules['a b'] instanceof jss.Rule)
    equal(ss.toString(), 'a {\n  float: left;\n}\na b {\n  float: left;\n}')
})

test('nesting without space', function () {
    var ss = new jss.Stylesheet({
        a: {
            float: 'left',
            '&b': {float: 'left'}
        }
    })
    ok(ss.rules.a instanceof jss.Rule)
    ok(ss.rules['ab'] instanceof jss.Rule)
    equal(ss.toString(), 'a {\n  float: left;\n}\nab {\n  float: left;\n}')
})

test('multi nesting', function () {
    var ss = new jss.Stylesheet({
        a: {
            float: 'left',
            '&b': {float: 'left'},
            '& c': {float: 'left'}
        }
    })
    ok(ss.rules.a instanceof jss.Rule)
    ok(ss.rules.ab instanceof jss.Rule)
    ok(ss.rules['a c'] instanceof jss.Rule)
    equal(ss.toString(), 'a {\n  float: left;\n}\nab {\n  float: left;\n}\na c {\n  float: left;\n}')
})

test('multi nesting in one selector', function () {
    var ss = new jss.Stylesheet({
        a: {
            float: 'left',
            '&b, &c': {float: 'left'}
        }
    })
    ok(ss.rules.a instanceof jss.Rule)
    ok(ss.rules['ab, ac'] instanceof jss.Rule)
    equal(ss.toString(), 'a {\n  float: left;\n}\nab, ac {\n  float: left;\n}')
})
