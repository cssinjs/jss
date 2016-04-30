import jss from 'jss'
import {setup} from '../utils'

QUnit.module('Integration rules', setup)

test('empty instance', () => {
  let rule = jss.createRule()
  equal(rule.type, 'regular')
  equal(rule.className, 'jss-0-0')
  equal(rule.selector, '.jss-0-0')
  rule = jss.createRule()
  equal(rule.className, 'jss-0-1')
  equal(rule.selector, '.jss-0-1')
  deepEqual(rule.style, {})
})

test('create instance with styles only', () => {
  const rule = jss.createRule({float: 'left'})
  deepEqual(rule.style, {float: 'left'})
  equal(rule.className.substr(0, 3), 'jss')
  equal(rule.selector.substr(0, 4), '.jss')
})

test('create instance with styles and options', () => {
  const options = {}
  const rule = jss.createRule({float: 'left'}, options)
  deepEqual(rule.style, {float: 'left'})
  equal(rule.className.substr(0, 3), 'jss')
  equal(rule.selector.substr(0, 4), '.jss')
  ok(rule.options.named)
  strictEqual(rule.options.jss, jss)
})

test('create instance with all params', () => {
  const options = {named: false}
  const rule = jss.createRule('a', {float: 'left'}, options)
  deepEqual(rule.style, {float: 'left'})
  equal(rule.className, '')
  equal(rule.selector, 'a')
  ok(!rule.options.named)
  strictEqual(rule.options.jss, jss)
})

test('toString', () => {
  const rule = jss.createRule('a', {float: 'left', width: '1px'}, {named: false})
  equal(rule.toString(), 'a {\n  float: left;\n  width: 1px;\n}')
})

test('toString without selector', () => {
  const rule = jss.createRule('a', {float: 'left', width: 1}, {named: false})
  equal(rule.toString({selector: false}), '\nfloat: left;\nwidth: 1;')
})

test('multiple declarations with identical property names', () => {
  const rule = jss.createRule('a', {display: ['inline', 'run-in']}, {named: false})
  equal(rule.toString(), 'a {\n  display: inline;\n  display: run-in;\n}')
})

test('@charset', () => {
  const rule = jss.createRule('@charset', '"utf-8"')
  equal(rule.type, 'simple')
  equal(rule.name, '@charset')
  equal(rule.value, '"utf-8"')
  equal(rule.toString(), '@charset "utf-8";')
})

test('@import', () => {
  let rule = jss.createRule('@import', '"something"')
  equal(rule.type, 'simple')
  equal(rule.toString(), '@import "something";')
  rule = jss.createRule('@import', 'url("something") print')
  equal(rule.toString(), '@import url("something") print;')
})

test('@namespace', () => {
  const rule = jss.createRule('@namespace', 'svg url(http://www.w3.org/2000/svg)')
  equal(rule.type, 'simple')
  equal(rule.toString(), '@namespace svg url(http://www.w3.org/2000/svg);')
})

test('@keyframes', () => {
  const rule = jss.createRule('@keyframes id', {
    from: {top: 0},
    '30%': {top: 30},
    '60%, 70%': {top: 80}
  })
  equal(rule.type, 'keyframe')
  equal(rule.selector, '@keyframes id')
  const css =
    '@keyframes id {\n' +
    '  from {\n' +
    '    top: 0;\n' +
    '  }\n' +
    '  30% {\n' +
    '    top: 30;\n' +
    '  }\n' +
    '  60%, 70% {\n' +
    '    top: 80;\n' +
    '  }\n' +
    '}'
  equal(rule.toString(), css)
})

test('@media', () => {
  const rule = jss.createRule('@media print', {button: {display: 'none'}}, {named: false})
  equal(rule.type, 'conditional')
  equal(rule.selector, '@media print')
  equal(rule.toString(), '@media print {\n  button {\n    display: none;\n  }\n}')
})

test('@media named', () => {
  const rule = jss.createRule('@media print', {
    button: {
      display: 'none'
    }
  })
  equal(rule.type, 'conditional')
  equal(rule.selector, '@media print')
  equal(rule.toString(), '@media print {\n  .button--jss-0-1 {\n    display: none;\n  }\n}')
})

test('@media named with an empty rule', () => {
  const rule = jss.createRule('@media print', {
    button: {}
  })
  equal(rule.toString(), '@media print {\n}')
})

test('@font-face', () => {
  let rule = jss.createRule('@font-face', {
    'font-family': 'MyHelvetica',
    src: 'local("Helvetica")'
  })
  equal(rule.type, 'font-face')
  equal(rule.selector, '@font-face')
  equal(rule.toString(), '@font-face {\n  font-family: MyHelvetica;\n  src: local("Helvetica");\n}')
  rule = jss.createRule('@font-face', {
    'font-family': 'MyHelvetica',
    src: 'local("Helvetica")'
  }, {named: true})
  equal(rule.toString(), '@font-face {\n  font-family: MyHelvetica;\n  src: local("Helvetica");\n}')
})

test('@font-face with an array of styles', () => {
  let rule = jss.createRule('@font-face', [
    {
      'font-family': 'MyHelvetica',
      src: 'local("Helvetica")'
    },
    {
      'font-family': 'MyComicSans',
      src: 'local("ComicSans")'
    },
  ])
  equal(rule.type, 'font-face')
  equal(rule.selector, '@font-face')
  equal(
    rule.toString(),
    '@font-face {\n' +
    '  font-family: MyHelvetica;\n' +
    '  src: local("Helvetica");\n' +
    '}\n' +
    '@font-face {\n' +
    '  font-family: MyComicSans;\n' +
    '  src: local("ComicSans");\n' +
    '}\n'
  )
  rule = jss.createRule('@font-face', [
    {
      'font-family': 'MyHelvetica',
      src: 'local("Helvetica")'
    },
    {
      'font-family': 'MyComicSans',
      src: 'local("ComicSans")'
    },
  ], {named: true})
  equal(rule.type, 'font-face')
  equal(rule.selector, '@font-face')
  equal(
    rule.toString(),
    '@font-face {\n' +
    '  font-family: MyHelvetica;\n' +
    '  src: local("Helvetica");\n' +
    '}\n' +
    '@font-face {\n' +
    '  font-family: MyComicSans;\n' +
    '  src: local("ComicSans");\n' +
    '}\n'
  )
})

test('@supports', () => {
  const rule = jss.createRule('@supports ( display: flexbox )', {
    button: {
      display: 'none'
    }
  })
  equal(rule.type, 'conditional')
  equal(rule.selector, '@supports ( display: flexbox )')
  const css =
    '@supports ( display: flexbox ) {\n' +
    '  .button--jss-0-1 {\n' +
    '    display: none;\n' +
    '  }\n' +
    '}'
  equal(rule.toString(), css)
})

test('.toJSON()', () => {
  const style = {color: 'red'}
  const rule = jss.createRule(style)
  deepEqual(rule.toJSON(), style, 'declarations are correct')
})

test('.toJSON() with nested rules', () => {
  const style = {color: 'red', '&:hover': {color: 'blue'}}
  const rule = jss.createRule(style)
  deepEqual(rule.toJSON(), {color: 'red'}, 'nested rules removed')
})

test('.prop() virtual', () => {
  const rule = jss.createRule()
  rule.prop('float', 'left')
  equal(rule.prop('float'), 'left')
  rule.prop('width', 0)
  equal(rule.prop('width'), 0)
})
