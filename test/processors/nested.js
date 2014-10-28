QUnit.module('Nested preprocessor')

test('nesting extend', function () {
    var ss = new jss.Stylesheet({
        a: {
            float: 'left',
            '& b': {
                float: 'left'
            }
        }
    })
    ok(ss.rules.a instanceof jss.Rule)
    ok(ss.rules['a b'] instanceof jss.Rule)
    equal(ss.toString(), 'a {\n  float: left;\n}\na b {\n  float: left;\n}')
})
