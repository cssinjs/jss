import jss from 'jss'
import * as utils from '../utils'

QUnit.module('StyleSheet', utils.setup)

test('.createStyleSheet() without args', () => {
  const sheet = jss.createStyleSheet()
  equal(sheet.deployed, false, '.deployed is false')
  equal(sheet.attached, false, '.attached is false')
  equal(sheet.options.named, true, '.options.named is true')
  deepEqual(sheet.classes, {}, '.classes is an empty object')
})

test('sheet.attach() and sheet.detach()', () => {
  const sheet = jss.createStyleSheet().attach()
  const style = utils.getStyle()
  ok(sheet.attached, '.attached is true')

  // DOM Tests.
  ok(style, 'style is rendered, meta attr is set')
  equal(style.innerHTML.trim(), sheet.toString().trim(), 'style text in DOM is correct')
  sheet.detach()
  equal(sheet.attached, false, '.attached is false')
  equal(style.parentNode, undefined, 'style is removed')
})

test('.createStyleSheet() with one rule', () => {
  const sheet = jss.createStyleSheet({a: {float: 'left'}})
  const rule = sheet.getRule('a')
  ok(rule, 'rule a created')
  equal(sheet.classes.a, 'a--jss-0-0', 'class is registered')
  equal(rule.className, 'a--jss-0-0', 'rule.className is correct')
  equal(rule.selector, '.a--jss-0-0', 'rule.selector is correct')
})

test('Options {media, meta}', () => {
  const sheet = jss.createStyleSheet(null, {media: 'screen', meta: 'test'}).attach()
  const style = utils.getStyle()
  equal(sheet.options.media, 'screen', 'option media is defined')
  equal(sheet.options.meta, 'test', 'opption meta is defined')

  // DOM Tests.
  equal(style.getAttribute('media'), 'screen', 'media attr is set')
  equal(style.getAttribute('data-meta'), 'test', 'meta attr is set')
  sheet.detach()
})

test('Options {named: false}', () => {
  const sheet = jss.createStyleSheet({'.a': {float: 'left'}}, {named: false})
  const rule = sheet.getRule('.a')
  ok(rule, 'rule is created')
  equal(rule.options.named, false, 'rule should have named: false')
  equal('.a' in sheet.classes, false, 'rule should not be in classes')
  equal(sheet.options.named, false, 'sheet should have named: false')
})

test('Options {link: true}', () => {
  const sheet = jss.createStyleSheet({a: {float: 'left'}}, {link: true}).attach()
  ok(sheet.getRule('a').renderable instanceof CSSStyleRule, 'renderable added')
  sheet.addRule('b', {color: 'red'})
  ok(sheet.getRule('b').renderable instanceof CSSStyleRule, 'renderable added to an added rule')
  sheet.detach()
})

test('Option virtual: true', () => {
  const sheet = jss.createStyleSheet({a: {float: 'left'}}, {virtual: true})
  sheet.attach()
  equal(document.getElementsByTagName('style').length, 0)
  sheet.detach()
})

test('sheet.getRule()', () => {
  let sheet = jss.createStyleSheet({a: {float: 'left'}}, {named: true})
  ok(sheet.getRule('a'), 'returns rule by name')
  ok(sheet.getRule('.a--jss-0-0'), 'returns rule by selector')
  sheet = jss.createStyleSheet({a: {float: 'left'}}, {named: false})
  ok(sheet.getRule('a'), 'returns rule by a global selector')
})

test('.addRule() to attached unnamed sheet', () => {
  const sheet = jss.createStyleSheet(null, {named: false}).attach()
  const rule = sheet.addRule('.a', {float: 'left'})
  const style = utils.getStyle()
  equal(utils.getRules(style).length, 1, 'rule inserted to DOM')
  equal(utils.getCss(style), '.a { float: left; }', 'rendered CSS is ok')
  strictEqual(sheet.getRule('.a'), rule, 'rule is correctly registered')
  strictEqual(sheet.getRule('.a').options.sheet, sheet, 'rule has correct options.sheet')
  sheet.detach()
})

test('.addRule() to attached named sheet', () => {
  const sheet = jss.createStyleSheet(null).attach()
  const rule = sheet.addRule('a', {float: 'left'})
  const style = utils.getStyle()
  equal(utils.getRules(style).length, 1, 'rule inserted to DOM')
  equal(utils.getCss(style), '.a--jss-0-0 { float: left; }', 'rendered CSS is ok')
  strictEqual(sheet.getRule('a'), rule, 'rule is correctly registered')
  strictEqual(sheet.getRule('a').options.sheet, sheet, 'rule has correct options.sheet')
  sheet.detach()
})

test('.toString() on unnamed sheet', () => {
  const sheet = jss.createStyleSheet(
    {'.a': {width: '1px', float: 'left'}},
    {named: false}
  ).attach()
  const expected = '.a {\n  width: 1px;\n  float: left;\n}'
  equal(sheet.toString(), expected, '.toString() returned correct CSS')
  const style = utils.getStyle()
  equal(utils.getCss(style), expected, 'correct CSS rendered in DOM')
  sheet.detach()
})

test('.toString() on named sheet', () => {
  const sheet = jss.createStyleSheet({
    a: {width: '1px', float: 'left'}
  }).attach()
  const expected = '.a--jss-0-0 {\n  width: 1px;\n  float: left;\n}'
  equal(sheet.toString(), expected, '.toString() returned correct CSS')
  const style = utils.getStyle()
  equal(utils.getCss(style), expected, 'correct CSS rendered in DOM')
  sheet.detach()
})

test('.toString() unnamed sheet with media query', () => {
  const sheet = jss.createStyleSheet({
    '.a': {color: 'red'},
    '@media (min-width: 1024px)': {'.a': {color: 'blue'}},
    '@media (min-width: 1000px)': {'.a': {color: 'green'}}
  }, {named: false}).attach()
  const expected = [
    '.a {',
    '  color: red;',
    '}',
    '@media (min-width: 1024px) {',
    '  .a {',
    '    color: blue;',
    '  }',
    '}',
    '@media (min-width: 1000px) {',
    '  .a {',
    '    color: green;',
    '  }',
    '}'
  ].join('\n')
  equal(sheet.toString(), expected, '.toString returned expected css')
  const style = utils.getStyle()
  equal(utils.getCss(style), expected, 'correct CSS rendered in DOM')
  sheet.detach()
})

test('toString named with media query', () => {
  const sheet = jss.createStyleSheet({
    a: {color: 'red'},
    '@media (min-width: 1024px)': {
      a: {color: 'blue'},
      b: {color: 'white'}
    },
    '@media (min-width: 100px)': {
      a: {color: 'green'}
    }
  }).attach()
  const expected = [
    '.a--jss-0-0 {',
    '  color: red;',
    '}',
    '@media (min-width: 1024px) {',
    '  .a--jss-0-0 {',
    '    color: blue;',
    '  }',
    '  .b--jss-0-3 {',
    '    color: white;',
    '  }',
    '}',
    '@media (min-width: 100px) {',
    '  .a--jss-0-0 {',
    '    color: green;',
    '  }',
    '}'
  ].join('\n')
  equal(sheet.toString(), expected, '.toString returned expected css')
  const style = utils.getStyle()
  equal(utils.getCss(style), expected, 'correct CSS rendered in DOM')
  sheet.detach()
})

test('.toString() empty rule trim', () => {
  const sheet = jss.createStyleSheet({
    a: {color: 'red'},
    b: {},
    c: {color: 'green'},
    d: {}
  })
  sheet.attach()
  equal(
    sheet.toString(),
    '.a--jss-0-0 {\n  color: red;\n}\n.c--jss-0-2 {\n  color: green;\n}',
    'empty rule was removed'
  )
  sheet.detach()
})

test('.toString() empty font-face rule trim', () => {
  const sheet = jss.createStyleSheet({
    a: {color: 'red'},
    b: {},
    c: {color: 'green'},
    '@font-face': {}
  })
  sheet.attach()
  equal(
    sheet.toString(),
    '.a--jss-0-0 {\n  color: red;\n}\n.c--jss-0-2 {\n  color: green;\n}',
    'empty font face rule was removed '
  )
  sheet.detach()
})

test('.toString() empty conditional rule trim', () => {
  const sheet = jss.createStyleSheet({
    a: {color: 'red'},
    '@media print': {}
  })
  sheet.attach()
  equal(
    sheet.toString(),
    '.a--jss-0-0 {\n  color: red;\n}',
    'empty media rule was removed'
  )
  sheet.detach()
})

test('.toString() all rule types', () => {
  const sheet = jss.createStyleSheet({
    '@charset': '"utf-8"',
    '@import': 'bla',
    '@namespace': 'bla',
    '.a': {
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
    '.a {\n  float: left;\n}\n' +
    '@font-face {\n  font-family: MyHelvetica;\n  src: local("Helvetica");\n}\n' +
    '@keyframes id {\n  from {\n    top: 0;\n  }\n}\n' +
    '@media print {\n  button {\n    display: none;\n  }\n}\n' +
    '@supports ( display: flexbox ) {\n  button {\n    display: none;\n  }\n}',
    'all rules are correct'
  )
})
