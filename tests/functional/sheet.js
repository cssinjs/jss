import jss from 'jss'
import {setup, computeStyle, getStyle, getCss, getRules} from '../utils'

QUnit.module('Functional sheet', setup)

test('rule.prop()', () => {
  const sheet = jss.createStyleSheet({a: {float: 'left'}}, {link: true})
  const rule = sheet.getRule('a')
  sheet.attach()
  rule.prop('color', 'red')
  equal(rule.style.color, 'red', 'new prop is cached')
  equal(rule.prop('color'), 'red', 'new prop is returned')
  equal(rule.renderable.style.color, 'red', 'new rule is set to the DOM')
  sheet.detach()
})

test('rule.prop() ensure caching', () => {
  const sheet = jss.createStyleSheet({a: {float: 'left'}}, {link: true})
  const rule = sheet.getRule('a')
  sheet.attach()
  equal(rule.prop('color'), '', 'color is empty')
  ok('color' in rule.style, 'value is cached')
  sheet.detach()
})

test('rule.selector', () => {
  const sheet = jss.createStyleSheet(
    {a: {width: '1px'}},
    {link: true}
  ).attach()
  const rule = sheet.getRule('a')
  rule.selector = '.test'
  equal(rule.selector, '.test', 'setter and getter work')
  equal(computeStyle('test').width, '1px', 'selector applied correctly')
  equal(sheet.classes.a, 'test', 'classes map has been updated')
  sheet.detach()
})

test('.attach() and .detach()', () => {
  const sheet = jss.createStyleSheet().attach()
  const style = getStyle()
  ok(sheet.attached, '.attached is true')

  // DOM Tests.
  ok(style, 'style is rendered, meta attr is set')
  equal(style.innerHTML.trim(), sheet.toString().trim(), 'style text in DOM is correct')
  sheet.detach()
  equal(sheet.attached, false, '.attached is false')
  equal(style.parentNode, undefined, 'style is removed')
})

test('Options {media, meta}', () => {
  const sheet = jss.createStyleSheet(null, {media: 'screen', meta: 'test'}).attach()
  const style = getStyle()
  equal(sheet.options.media, 'screen', 'option media is defined')
  equal(sheet.options.meta, 'test', 'opption meta is defined')

  // DOM Tests.
  equal(style.getAttribute('media'), 'screen', 'media attr is set')
  equal(style.getAttribute('data-meta'), 'test', 'meta attr is set')
  sheet.detach()
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

test('.addRule() to attached unnamed sheet', () => {
  const sheet = jss.createStyleSheet(null, {named: false}).attach()
  const rule = sheet.addRule('.a', {float: 'left'})
  const style = getStyle()
  equal(getRules(style).length, 1, 'rule inserted to DOM')
  equal(getCss(style), '.a { float: left; }', 'rendered CSS is ok')
  strictEqual(sheet.getRule('.a'), rule, 'rule is correctly registered')
  strictEqual(sheet.getRule('.a').options.sheet, sheet, 'rule has correct options.sheet')
  sheet.detach()
})

test('.addRule() to attached named sheet', () => {
  const sheet = jss.createStyleSheet(null).attach()
  const rule = sheet.addRule('a', {float: 'left'})
  const style = getStyle()
  equal(getRules(style).length, 1, 'rule inserted to DOM')
  equal(getCss(style), '.a--jss-0-0 { float: left; }', 'rendered CSS is ok')
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
  const style = getStyle()
  equal(getCss(style), expected, 'correct CSS rendered in DOM')
  sheet.detach()
})

test('.toString() on named sheet', () => {
  const sheet = jss.createStyleSheet({
    a: {width: '1px', float: 'left'}
  }).attach()
  const expected = '.a--jss-0-0 {\n  width: 1px;\n  float: left;\n}'
  equal(sheet.toString(), expected, '.toString() returned correct CSS')
  const style = getStyle()
  equal(getCss(style), expected, 'correct CSS rendered in DOM')
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
  const style = getStyle()
  equal(getCss(style), expected, 'correct CSS rendered in DOM')
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
  const style = getStyle()
  equal(getCss(style), expected, 'correct CSS rendered in DOM')
  sheet.detach()
})
