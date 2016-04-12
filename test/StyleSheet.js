import jss from '../src'
import * as utils from './utils'

QUnit.module('StyleSheet', utils.setup)


test('create empty instance', () => {
  const sheet = jss.createStyleSheet()
  equal(sheet.deployed, false)
  equal(sheet.attached, false)
  ok(sheet.options.named)
  deepEqual(sheet.rules, {})
  deepEqual(sheet.classes, {})
})

test('attach with attribtues', () => {
  const sheet = jss.createStyleSheet(null, {media: 'screen', meta: 'test'}).attach()
  equal(sheet.renderer.element.getAttribute('media'), 'screen')
  equal(sheet.renderer.element.getAttribute('data-meta'), 'test')
  sheet.detach()
})

test('create instance with rules and generated classes', () => {
  const sheet = jss.createStyleSheet({a: {float: 'left'}})
  ok(sheet.rules.a)
  equal(sheet.classes.a, sheet.rules.a.className)
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
      meta: 'test'
    }
  )
  ok(sheet.rules.a)
  equal(sheet.options.media, 'screen')
  equal(sheet.options.meta, 'test')
  equal(sheet.renderer.element.getAttribute('media'), 'screen')
  equal(sheet.renderer.element.getAttribute('data-meta'), 'test')
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
  const cssText = sheet.renderer.element.innerHTML.trim() || sheet.renderer.element.sheet.cssRules[0].cssText
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
  const sheet = jss.createStyleSheet({a: {width: '1px', float: 'left'}})
  sheet.attach()
  const expected = '.a--jss-0-0 {\n  width: 1px;\n  float: left;\n}'
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
  const sheet = jss.createStyleSheet({
    a: {color: 'red'},
    '@media (min-width: 1024px)': {
      a: {color: 'blue'},
      b: {color: 'white'}
    }
  })
  sheet.attach()
  equal(sheet.toString(), '.a--jss-0-0 {\n  color: red;\n}\n@media (min-width: 1024px) {\n  .a--jss-0-0 {\n    color: blue;\n  }\n  .b--jss-0-3 {\n    color: white;\n  }\n}')
  sheet.detach()
})

test('toString empty rule trim', () => {
  const sheet = jss.createStyleSheet({
    a: {color: 'red'},
    b: {},
    c: {color: 'green'},
    d: {}
  })
  sheet.attach()
  equal(sheet.toString(), '.a--jss-0-0 {\n  color: red;\n}\n.c--jss-0-2 {\n  color: green;\n}')
  sheet.detach()
})

test('toString empty mixed rule trim', () => {
  const sheet = jss.createStyleSheet({
    a: {color: 'red'},
    b: {},
    c: {color: 'green'},
    '@font-face': {}
  })
  sheet.attach()
  equal(sheet.toString(), '.a--jss-0-0 {\n  color: red;\n}\n.c--jss-0-2 {\n  color: green;\n}')
  sheet.detach()
})

test('toString empty conditional rule trim', () => {
  const sheet = jss.createStyleSheet({
    a: {color: 'red'},
    '@media print': {}
  })
  sheet.attach()
  equal(sheet.toString(), '.a--jss-0-0 {\n  color: red;\n}')
  sheet.detach()
})

test('mixed rule types', () => {
  const sheet = jss.createStyleSheet({
    '@charset': '"utf-8"',
    '@import': 'bla',
    '@namespace': 'bla',
    a: {
      float: 'left'
    },
    '@font-face': {
      'font-family': 'MyHelvetica',
      src: 'local("Helvetica")'
    },
    '@keyframes id': {
      from: {top: 0}
    },
    '@media print': {
      button: {display: 'none'}
    },
    '@supports ( display: flexbox )': {
      button: {
        display: 'none'
      }
    }
  }, {named: false})

  equal(
    sheet.toString(),
    '@charset "utf-8";\n' +
    '@import bla;\n' +
    '@namespace bla;\n' +
    'a {\n  float: left;\n}\n' +
    '@font-face {\n  font-family: MyHelvetica;\n  src: local("Helvetica");\n}\n' +
    '@keyframes id {\n  from {\n    top: 0;\n  }\n}\n' +
    '@media print {\n  button {\n    display: none;\n  }\n}\n' +
    '@supports ( display: flexbox ) {\n  button {\n    display: none;\n  }\n}'
  )
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
  sheet.detach()
})
