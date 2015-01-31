'use strict'

QUnit.module('Rule')

test('create empty instance', function () {
    var rule = new jss.Rule()
    equal(rule.className, 'jss-0')
    equal(rule.selector, '.jss-0')
    rule = new jss.Rule()
    equal(rule.className, 'jss-1')
    equal(rule.selector, '.jss-1')
    deepEqual(rule.style, {})
    equal(rule.stylesheet, undefined)
})

test('create instance with selector only', function () {
    var rule = new jss.Rule('a')
    equal(rule.selector, 'a')
    deepEqual(rule.style, {})
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

test('add plugin', function () {
    var plugin = function () {}
    jss.use(plugin)
    equal(jss.plugins.registry.length, 1)
    strictEqual(jss.plugins.registry[0], plugin)
})

test('run plugins', function () {
    var executed = false
    function plugin() {
        executed = true
    }
    jss.use(plugin)
    jss.plugins.run(new jss.Rule())
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
    equal(rule.toString(), '@media print {\n  button {\n    display: none;\n  }\n}')
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

test('@font-face', function () {
    var rule = new jss.Rule('@font-face', {
        'font-family': 'MyHelvetica',
        src: 'local("Helvetica")'
    })
    equal(rule.selector, '@font-face')
    equal(rule.toString(), '@font-face {\n  font-family: MyHelvetica;\n  src: local("Helvetica");\n}')
})

test('applyTo', function () {
    new jss.Rule({
        float: 'left'
    }).applyTo(document.body)
    equal(document.body.style.float, 'left')

    new jss.Rule({
        display: ['inline', 'run-in']
    }).applyTo(document.body)
    equal(document.body.style.display, 'inline')
})

test('set/get rules virtual prop', function () {
    var rule = new jss.Rule()
    rule.prop('float', 'left')
    equal(rule.prop('float'), 'left')
})

test('set/get rules dom prop', function () {
    var ss = jss.createStyleSheet({a: {float: 'left'}}, {link: true})
    var rule = ss.rules.a
    ss.attach()
    rule.prop('color', 'red')
    equal(rule.style.color, 'red', 'new prop is cached')
    equal(rule.prop('color'), 'red', 'new prop is returned')
    equal(rule.CSSRule.style.color, 'red', 'new rule is set to the DOM')
    ss.detach()
})

test('get rules prop from the dom and cache it', function () {
    var ss = jss.createStyleSheet({a: {float: 'left'}}, {link: true})
    var rule = ss.rules.a
    ss.attach()
    equal(rule.prop('color'), '', 'color is empty')
    ok('color' in rule.style, 'value is cached')
    ss.detach()
})

