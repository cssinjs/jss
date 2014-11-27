'use strict'

QUnit.module('Rule')

test('create empty instance', function () {
    var rule = new jss.Rule()
    equal(rule.className, 'jss-0')
    equal(rule.selector, '.jss-0')
    rule = new jss.Rule()
    equal(rule.className, 'jss-1')
    equal(rule.selector, '.jss-1')
    equal(rule.style, undefined)
    equal(rule.stylesheet, undefined)
})

test('create instance with selector only', function () {
    var rule = new jss.Rule('a')
    equal(rule.selector, 'a')
    equal(rule.style, undefined)
    equal(rule.stylesheet, undefined)
})

test('create instance with styles only', function () {
    var rule = new jss.Rule({float: 'left'})
    equal(rule.stylesheet, undefined)
    deepEqual(rule.style, {float: 'left'})
    equal(rule.className.substr(0, 3), 'jss')
    equal(rule.selector.substr(0, 4), '.jss')
})

test('create instance with styles and stylesheet', function () {
    var ss = {}
    var rule = new jss.Rule({float: 'left'}, ss)
    deepEqual(rule.style, {float: 'left'})
    equal(rule.className.substr(0, 3), 'jss')
    equal(rule.selector.substr(0, 4), '.jss')
    strictEqual(rule.stylesheet, ss)
})

test('create instance with all params', function () {
    var ss = {}
    var rule = new jss.Rule('a', {float: 'left'}, ss)
    deepEqual(rule.style, {float: 'left'})
    equal(rule.className, undefined)
    equal(rule.selector, 'a')
    strictEqual(rule.stylesheet, ss)
})

test('add preprocessor', function () {
    var preprocessor = function () {}
    var preprocessors = jss.Rule.addPreprocessor(preprocessor)
    equal(preprocessors.length, 4)
    strictEqual(preprocessors[3], preprocessor)
})

test('run preprocessors', function () {
    var executed = false
    function preprocessor() {
        executed = true
    }
    jss.Rule.addPreprocessor(preprocessor)
    new jss.Rule().runPreprocessors()
    ok(executed)
})

test('toString', function () {
    var rule = new jss.Rule('a', {float: 'left', width: '1px'})
    equal(rule.toString(), 'a {\n  float: left;\n  width: 1px;\n}')
})

test('multiple declarations with identical property names', function () {
    var rule = new jss.Rule('a', {display: ['inline', 'run-in']})
    equal(rule.toString(), 'a {\n  display: inline;\n  display: run-in;\n}')
})

test('@media', function () {
    var rule = new jss.Rule('@media print', {button: {display: 'none'}})
    equal(rule.selector, '@media print')
    equal(rule.toString(), '@media print {\n  button: {\n    display: none;\n  }\n}')
})

test('@keyframes', function () {
    var rule = new jss.Rule('@keyframes a', {
        from: {top: 0},
        '30%': {top: 30},
        '60%, 70%': {top: 80}
    })
    equal(rule.selector, '@keyframes a')
    equal(rule.toString(), '@keyframes a {\n  from {\n    top: 0;\n  }\n  30% {\n    top: 30;\n  }\n  60%, 70% {\n    top: 80;\n  }\n}')
})
