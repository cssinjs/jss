'use strict'

QUnit.module('StyleSheet')

test('create empty instance', function () {
    var ss = new jss.StyleSheet()
    equal(ss.deployed, false)
    equal(ss.attached, false)
    equal(ss.attributes, null)
    ok(ss.element instanceof Element)
    deepEqual(ss.options, {named: false})
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

test('create instance with rules', function () {
    var ss = new jss.StyleSheet({a: {float: 'left'}})
    ok(ss.rules.a instanceof jss.Rule)
})

test('create instance with rules and generated classes', function () {
    var ss = new jss.StyleSheet({a: {float: 'left'}}, true)
    equal(typeof ss.classes.a, 'string')
    ok(ss.rules.a instanceof jss.Rule)
    ok(ss.options.named)
})

test('create instance with option named: true', function () {
    var ss = new jss.StyleSheet(null, {named: true})
    ok(ss.options.named)
})

test('accesible rule via selector even if named: true', function () {
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
    equal(ss.options.named, false)
    equal(ss.options.media, 'screen')
    equal(ss.options.type, 'text/css')
    equal(ss.options.title, 'test')
    equal(ss.element.getAttribute('media'), 'screen')
    equal(ss.element.getAttribute('type'), 'text/css')
    equal(ss.element.getAttribute('title'), 'test')
})

test('create instance with all params', function () {
    var ss = new jss.StyleSheet({a: {float: 'left'}}, true, {media: 'screen'})
    equal(typeof ss.classes.a, 'string')
    ok(ss.rules.a instanceof jss.Rule)
    ok(ss.options.named)
    equal(ss.options.media, 'screen')
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
    var ss = new jss.StyleSheet().attach()
    var rules = ss.addRule('aa', {float: 'left'})
    equal(ss.element.sheet.cssRules.length, 1)
    equal(ss.element.sheet.cssRules[0].cssText, 'aa { float: left; }')
    strictEqual(ss.rules.aa, rules[0])
    strictEqual(ss.getRule('aa'), rules[0])
    strictEqual(ss.rules.aa.stylesheet, ss)
    ss.detach()
})

test('addRules', function () {
    var ss = new jss.StyleSheet().attach()
    ss.addRules({aa: {float: 'left'}})
    ok(ss.rules.aa instanceof jss.Rule)
    ss.detach()
})

test('toString', function () {
    var ss = new jss.StyleSheet({a: {float: 'left', width: '1px'}})
    ss.attach()
    equal(ss.toString(), 'a {\n  float: left;\n  width: 1px;\n}')
    equal(ss.element.innerHTML, '\na {\n  float: left;\n  width: 1px;\n}\n')
    ss.detach()
})

test('link', function () {
    var ss = new jss.StyleSheet({a: {float: 'left'}}, {link: true})
    ss.attach()
    ok(ss.rules.a.CSSRule instanceof CSSStyleRule)
    ss.addRule('b', {color: 'red'})
    ok(ss.rules.b.CSSRule instanceof CSSStyleRule)
    ss.detach()
})
