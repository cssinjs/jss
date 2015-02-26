'use strict'

QUnit.module('StyleSheet')

test('create empty instance', function () {
    var ss = new jss.StyleSheet()
    equal(ss.deployed, false)
    equal(ss.attached, false)
    equal(ss.attributes, null)
    ok(ss.element instanceof Element)
    deepEqual(ss.options, {named: true})
    deepEqual(ss.rules, {})
    deepEqual(ss.classes, {})
    ok('media' in ss)
    ok('type' in ss)
    ok('title' in ss)
})

test('attach with attribtues', function () {
    var ss = new jss.StyleSheet(null, {media: 'screen'}).attach()
    equal(ss.element.getAttribute('media'), 'screen')
    ss.detach()
})

test('create instance with rules and generated classes', function () {
    var ss = new jss.StyleSheet({a: {float: 'left'}})
    ok(ss.rules.a instanceof jss.Rule)
    equal(typeof ss.classes.a, 'string')
    ok(ss.options.named)
    equal(ss.rules.a.options.name, 'a', 'name has been passed to the rule')
})

test('create instance with rules where selector is a global class', function () {
    var ss = new jss.StyleSheet({a: {float: 'left'}}, {named: false})
    ok(ss.rules.a instanceof jss.Rule)
    equal(ss.classes.a, null)
    ok(!ss.options.named)
})

test('accessible rule via selector even if named: true', function () {
    var ss = new jss.StyleSheet({bla: {float: 'left'}}, {named: true})
    ok(ss.rules.bla instanceof jss.Rule)
    ok(ss.rules[ss.rules.bla.selector] instanceof jss.Rule)
})

test('create instance with rules and attributes', function () {
    var ss = new jss.StyleSheet(
        {a: {float: 'left'}},
        {
            media: 'screen',
            type: 'text/css',
            title: 'test'
        }
    )
    ok(ss.rules.a instanceof jss.Rule)
    equal(ss.options.media, 'screen')
    equal(ss.options.type, 'text/css')
    equal(ss.options.title, 'test')
    equal(ss.element.getAttribute('media'), 'screen')
    equal(ss.element.getAttribute('type'), 'text/css')
    equal(ss.element.getAttribute('title'), 'test')
})

test('attach/detach', function () {
    var ss = new jss.StyleSheet({abc: {float: 'left'}}).attach()
    var style = document.getElementsByTagName('style')[0]
    ok(ss.attached)
    strictEqual(style, ss.element)
    equal(style.innerHTML.trim(), ss.toString())
    ss.detach()
    equal(ss.attached, false)
    equal(document.getElementsByTagName('style').length, 0)
})

test('addRule/getRule', function () {
    var ss = new jss.StyleSheet(null, {named: false}).attach()
    var rules = ss.addRule('aa', {float: 'left'})
    equal(ss.element.sheet.cssRules.length, 1)
    equal(ss.element.sheet.cssRules[0].cssText, 'aa { float: left; }')
    strictEqual(ss.rules.aa, rules[0])
    strictEqual(ss.getRule('aa'), rules[0])
    strictEqual(ss.rules.aa.options.sheet, ss)
    ss.detach()
})

test('addRules', function () {
    var ss = new jss.StyleSheet().attach()
    ss.addRules({aa: {float: 'left'}})
    ok(ss.rules.aa instanceof jss.Rule)
    ss.detach()
})

test('toString unnamed', function () {
    var ss = new jss.StyleSheet({a: {float: 'left', width: '1px'}}, {named: false})
    ss.attach()
    equal(ss.toString(), 'a {\n  float: left;\n  width: 1px;\n}')
    equal(ss.element.innerHTML, '\na {\n  float: left;\n  width: 1px;\n}\n')
    ss.detach()
})

test('toString named', function () {
    jss.Rule.uid = 0
    var ss = new jss.StyleSheet({a: {float: 'left', width: '1px'}})
    ss.attach()
    equal(ss.toString(), '.jss-0 {\n  float: left;\n  width: 1px;\n}')
    equal(ss.element.innerHTML, '\n.jss-0 {\n  float: left;\n  width: 1px;\n}\n')
    ss.detach()
})

test('toString unnamed with media query', function () {
    jss.Rule.uid = 0
    var ss = new jss.StyleSheet({
        a: {color: 'red'},
        '@media (min-width: 1024px)': {a: {color: 'blue'}}
    }, {named: false})
    ss.attach()
    equal(ss.toString(), 'a {\n  color: red;\n}\n@media (min-width: 1024px) {\n  a {\n    color: blue;\n  }\n}')
    equal(ss.element.innerHTML, '\na {\n  color: red;\n}\n@media (min-width: 1024px) {\n  a {\n    color: blue;\n  }\n}\n')
    ss.detach()
})

test('link', function () {
    var ss = new jss.StyleSheet({a: {float: 'left'}}, {link: true})
    ss.attach()
    ok(ss.rules.a.CSSRule instanceof CSSStyleRule)
    ss.addRule('b', {color: 'red'})
    ok(ss.rules.b.CSSRule instanceof CSSStyleRule)
    ss.detach()
})

test('named rules with unnamed child rules', function () {
    jss.Rule.uid = 0
    var added
    jss.use(function (rule) {
        if (added) return
        rule.addChild('b', {color: 'red'}, {named: false})
        added = true
    })
    var ss = new jss.StyleSheet({a: {float: 'left'}})
    jss.plugins.registry = []
    equal(ss.toString(), '.jss-0 {\n  float: left;\n}\nb {\n  color: red;\n}')
})
