QUnit.module('Rule')

test('create empty instance', function () {
    var rule = new jss.Rule()
    equal(rule.className, 'jss-0')
    equal(rule.selector, '.jss-0')
    rule = new jss.Rule()
    equal(rule.className, 'jss-1')
    equal(rule.selector, '.jss-1')
    equal(rule.style, undefined)
    equal(rule.stylesheet, undefined)
})

test('create instance with selector only', function () {
    var rule = new jss.Rule('a')
    equal(rule.selector, 'a')
    equal(rule.style, undefined)
    equal(rule.stylesheet, undefined)
})

test('create instance with styles only', function () {
    var rule = new jss.Rule({float: 'left'})
    equal(rule.stylesheet, undefined)
    deepEqual(rule.style, {float: 'left'})
    equal(rule.className.substr(0, 3), 'jss')
    equal(rule.selector.substr(0, 4), '.jss')
})

test('create instance with styles and stylesheet', function () {
    var ss = {}
    var rule = new jss.Rule({float: 'left'}, ss)
    deepEqual(rule.style, {float: 'left'})
    equal(rule.className.substr(0, 3), 'jss')
    equal(rule.selector.substr(0, 4), '.jss')
    strictEqual(rule.stylesheet, ss)
})

test('create instance with all params', function () {
    var ss = {}
    var rule = new jss.Rule('a', {float: 'left'}, ss)
    deepEqual(rule.style, {float: 'left'})
    equal(rule.className, undefined)
    equal(rule.selector, 'a')
    strictEqual(rule.stylesheet, ss)
})

test('add preprocessor', function () {
    var preprocessor = function () {}
    var preprocessors = jss.Rule.addPreprocessor(preprocessor)
    equal(preprocessors.length, 3)
    strictEqual(preprocessors[2], preprocessor)
})

test('run preprocessors', function () {
    var executed = false
    function preprocessor() {
        executed = true
    }
    jss.Rule.addPreprocessor(preprocessor)
    new jss.Rule().runPreprocessors()
    ok(executed)
})

test('toString', function () {
    var rule = new jss.Rule('a', {float: 'left', width: '1px'})
    equal(rule.toString(), 'a {\n  float: left;\n  width: 1px;\n}')
})

