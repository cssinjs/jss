import jss from 'jss'
import {setup} from '../utils'

QUnit.module('Integration sheet', setup)

test('without args', () => {
  const sheet = jss.createStyleSheet()
  equal(sheet.deployed, false, '.deployed is false')
  equal(sheet.attached, false, '.attached is false')
  equal(sheet.options.named, true, '.options.named is true')
  deepEqual(sheet.classes, {}, '.classes is an empty object')
})

test('.toString() empty rule trim', () => {
  const sheet = jss.createStyleSheet({
    a: {color: 'red'},
    b: {},
    c: {color: 'green'},
    d: {}
  })
  equal(
    sheet.toString(),
    '.a--jss-0-0 {\n  color: red;\n}\n.c--jss-0-2 {\n  color: green;\n}',
    'empty rule was removed'
  )
})

test('.toString() empty font-face rule trim', () => {
  const sheet = jss.createStyleSheet({
    a: {color: 'red'},
    b: {},
    c: {color: 'green'},
    '@font-face': {}
  })
  equal(
    sheet.toString(),
    '.a--jss-0-0 {\n  color: red;\n}\n.c--jss-0-2 {\n  color: green;\n}',
    'empty font face rule was removed '
  )
})

test('.toString() empty conditional rule trim', () => {
  const sheet = jss.createStyleSheet({
    a: {color: 'red'},
    '@media print': {}
  })
  equal(
    sheet.toString(),
    '.a--jss-0-0 {\n  color: red;\n}',
    'empty media rule was removed'
  )
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

test('.createStyleSheet() with one rule', () => {
  const sheet = jss.createStyleSheet({a: {float: 'left'}})
  const rule = sheet.getRule('a')
  ok(rule, 'rule a created')
  equal(sheet.classes.a, 'a--jss-0-0', 'class is registered')
  equal(rule.className, 'a--jss-0-0', 'rule.className is correct')
  equal(rule.selector, '.a--jss-0-0', 'rule.selector is correct')
})

test('Options {named: false}', () => {
  const sheet = jss.createStyleSheet({'.a': {float: 'left'}}, {named: false})
  const rule = sheet.getRule('.a')
  ok(rule, 'rule is created')
  equal(rule.options.named, false, 'rule should have named: false')
  equal('.a' in sheet.classes, false, 'rule should not be in classes')
  equal(sheet.options.named, false, 'sheet should have named: false')
})

test('.getRule()', () => {
  let sheet = jss.createStyleSheet({a: {float: 'left'}}, {named: true})
  ok(sheet.getRule('a'), 'returns rule by name')
  ok(sheet.getRule('.a--jss-0-0'), 'returns rule by selector')
  sheet = jss.createStyleSheet({a: {float: 'left'}}, {named: false})
  ok(sheet.getRule('a'), 'returns rule by a global selector')
})
