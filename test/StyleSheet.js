import jss from '../src'
import * as utils from './utils'

QUnit.module('StyleSheet')

test('create empty instance', () => {
  const sheet = jss.createStyleSheet()
  equal(sheet.deployed, false)
  equal(sheet.attached, false)
  ok(sheet.options.named)
  deepEqual(sheet.rules, {})
  deepEqual(sheet.classes, {})
})

test('attach with attribtues', () => {
  const sheet = jss.createStyleSheet(null, {media: 'screen'}).attach()
  equal(sheet.renderer.element.getAttribute('media'), 'screen')
  sheet.detach()
})

test('create instance with rules and generated classes', () => {
  const sheet = jss.createStyleSheet({a: {float: 'left'}})
  ok(sheet.rules.a)
  equal(typeof sheet.classes.a, 'string')
  ok(sheet.options.named)
})

test('create instance with rules where selector is a global class', () => {
  const sheet = jss.createStyleSheet({a: {float: 'left'}}, {named: false})
  ok(sheet.rules.a)
  ok(!('a' in sheet.classes))
  ok(!sheet.options.named)
})

test('accessible rule via selector even if named: true', () => {
  const sheet = jss.createStyleSheet({bla: {float: 'left'}}, {named: true})
  ok(sheet.rules.bla)
  ok(sheet.rules[sheet.rules.bla.selector])
})

test('create instance with rules and attributes', () => {
  const sheet = jss.createStyleSheet(
    {a: {float: 'left'}},
    {
      media: 'screen',
      type: 'text/css',
      title: 'test'
    }
  )
  ok(sheet.rules.a)
  equal(sheet.options.media, 'screen')
  equal(sheet.options.type, 'text/css')
  equal(sheet.options.title, 'test')
  equal(sheet.renderer.element.getAttribute('media'), 'screen')
  equal(sheet.renderer.element.getAttribute('type'), 'text/css')
  equal(sheet.renderer.element.getAttribute('title'), 'test')
})

test('attach/detach', () => {
  const sheet = jss.createStyleSheet({abc: {float: 'left'}}).attach()
  const style = document.getElementsByTagName('style')[0]
  ok(sheet.attached)
  strictEqual(style, sheet.renderer.element)
  equal(utils.normalizeCssText(style.innerHTML), utils.normalizeCssText(sheet.toString()))
  sheet.detach()
  equal(sheet.attached, false)
  equal(document.getElementsByTagName('style').length, 0)
})

test('addRule/getRule on attached sheet', () => {
  const sheet = jss.createStyleSheet(null, {named: false}).attach()
  const rule = sheet.addRule('a', {float: 'left'})
  const rules = utils.getRules(sheet.renderer.element)
  equal(rules.length, 1)
  const expected = 'a{float:left}'
  // IE8 returns css from innerHTML even when inserted using addRule.
  const cssText = sheet.renderer.element.innerHTML.trim() || sheet.renderer.element.sheet.rules[0].cssText
  equal(utils.normalizeCssText(cssText), expected)
  strictEqual(sheet.rules.a, rule)
  strictEqual(sheet.getRule('a'), rule)
  strictEqual(sheet.rules.a.options.sheet, sheet)
  sheet.detach()
})

test('toString unnamed', () => {
  const sheet = jss.createStyleSheet({a: {width: '1px', float: 'left'}}, {named: false})
  sheet.attach()
  const expected = 'a {\n  width: 1px;\n  float: left;\n}'
  equal(sheet.toString(), expected)
  equal(utils.normalizeCssText(sheet.renderer.element.innerHTML), utils.normalizeCssText(expected))
  sheet.detach()
})

test('toString named', () => {
  jss.uid.reset()
  const sheet = jss.createStyleSheet({a: {width: '1px', float: 'left'}})
  sheet.attach()
  const expected = '.jss-0-0 {\n  width: 1px;\n  float: left;\n}'
  equal(sheet.toString(), expected)
  equal(utils.normalizeCssText(sheet.renderer.element.innerHTML), utils.normalizeCssText(expected))
  sheet.detach()
})

test('toString unnamed with media query', () => {
  const sheet = jss.createStyleSheet({
    a: {color: 'red'},
    '@media (min-width: 1024px)': {a: {color: 'blue'}}
  }, {named: false})
  sheet.attach()
  deepEqual(sheet.classes, {})
  equal(sheet.toString(), 'a {\n  color: red;\n}\n@media (min-width: 1024px) {\n  a {\n    color: blue;\n  }\n}')
  if (utils.mediaQueriesSupported) {
    equal(sheet.renderer.element.innerHTML, '\na {\n  color: red;\n}\n@media (min-width: 1024px) {\n  a {\n    color: blue;\n  }\n}\n')
  }
  sheet.detach()
})

test('toString named with media query', () => {
  jss.uid.reset()
  const sheet = jss.createStyleSheet({
    a: {color: 'red'},
    '@media (min-width: 1024px)': {
      a: {color: 'blue'},
      b: {color: 'white'}
    }
  })
  sheet.attach()
  equal(sheet.toString(), '.jss-0-0 {\n  color: red;\n}\n@media (min-width: 1024px) {\n  .jss-0-0 {\n    color: blue;\n  }\n  .jss-0-2 {\n    color: white;\n  }\n}')
  sheet.detach()
})

test('link', () => {
  const sheet = jss.createStyleSheet({a: {float: 'left'}}, {link: true})
  sheet.attach()
  ok(sheet.rules.a.renderable instanceof CSSStyleRule)
  sheet.addRule('b', {color: 'red'})
  ok(sheet.rules.b.renderable instanceof CSSStyleRule)
  sheet.detach()
})

test('virtual rendering', () => {
  const sheet = jss.createStyleSheet({a: {float: 'left'}}, {virtual: true})
  sheet.attach()
  equal(document.getElementsByTagName('style').length, 0)
})
