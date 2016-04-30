import jss, {create, Jss, StyleSheet} from 'jss'
import {setup} from '../utils'

QUnit.module('Integration jss', setup)

test('exports', () => {
  ok(jss instanceof Jss, 'default export is a Jss instance')
  equal(typeof create, 'function', 'create function is exported')
})

test('.version', () => {
  equal(typeof jss.version, 'string', 'returns JSS version')
})

test('.create()', () => {
  ok(jss.create() instanceof Jss, 'returns a Jss instance')
})

test('.createStyleSheet()', () => {
  const sheet = jss.createStyleSheet()
  ok(sheet instanceof StyleSheet, 'returns a StyleSheet instance')
  ok(jss.sheets.registry.indexOf(sheet) >= 0, 'adds sheet to sheets registry')
})

test('sheets.toString()', () => {
  const sheet1 = jss.createStyleSheet({a: {color: 'red'}})
  const sheet2 = jss.createStyleSheet({a: {color: 'blue'}})

  ok(jss.sheets.registry.indexOf(sheet1) >= 0, 'adds sheet1 to sheets registry')
  ok(jss.sheets.registry.indexOf(sheet2) >= 0, 'adds sheet2 to sheets registry')
  const css =
    '.a--jss-0-0 {\n' +
    '  color: red;\n' +
    '}\n' +
    '.a--jss-0-1 {\n' +
    '  color: blue;\n' +
    '}'
  equal(jss.sheets.toString(), css, 'returns CSS of all sheets')
})


test('.use() with @media', () => {
  let executed = 0
  function plugin() {
    executed++
  }
  jss.use(plugin)
  jss.createRule('@media', {
    button: {float: 'left'}
  })
  equal(executed, 2)
})

test('.use() with @keyframes', () => {
  let executed = 0
  function plugin() {
    executed++
  }
  jss.use(plugin)
  jss.createRule('@keyframes', {
    from: {top: 0},
    to: {top: 10}
  })
  equal(executed, 3)
})

test('.use() verify rule', () => {
  let passedRule
  jss.use(rule => {
    passedRule = rule
  })
  const rule = jss.createRule()
  strictEqual(rule, passedRule, 'passed correct rule')
})

test('.use() multiple plugins', () => {
  let executed1
  let executed2

  const plugin1 = (rule) => {
    executed1 = rule
  }
  const plugin2 = (rule) => {
    executed2 = rule
  }
  jss.use(plugin1, plugin2)
  const rule = jss.createRule()
  jss.plugins.run(rule)

  equal(jss.plugins.registry.length, 2, 'adds all plugins to the registry')
  strictEqual(jss.plugins.registry[0], plugin1, 'adds first plugin in the right order')
  strictEqual(jss.plugins.registry[1], plugin2, 'adds second plugin in the right order')
  strictEqual(executed1, rule, 'executed first plugin')
  strictEqual(executed2, rule, 'executed second plugin')
})
