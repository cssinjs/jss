import jss, {create, Jss, StyleSheet, Rule} from '../src'
import * as utils from './utils'
import {version} from '../package.json'

QUnit.module('Jss', utils.setup)

test('exports', () => {
  ok(jss instanceof Jss, 'default export is a Jss instance')
  equal(typeof create, 'function', 'create function is exported')
})

test('.create()', () => {
  ok(jss.create() instanceof Jss, 'returns a Jss instance')
})

test('.createStyleSheet()', () => {
  const sheet = jss.createStyleSheet()
  ok(sheet instanceof StyleSheet, 'returns a StyleSheet instance')
  ok(jss.sheets.registry.indexOf(sheet) >= 0, 'adds sheet to sheets registry')
})

test('.sheets', () => {
  const sheet1 = jss.createStyleSheet({a: {color: 'red'}})
  const sheet2 = jss.createStyleSheet({a: {color: 'blue'}})

  ok(jss.sheets.registry.indexOf(sheet1) >= 0, 'adds sheet1 to sheets registry')
  ok(jss.sheets.registry.indexOf(sheet2) >= 0, 'adds sheet2 to sheets registry')
  const css = [
    '.a--jss-0-0 {',
    '  color: red;',
    '}',
    '.a--jss-0-1 {',
    '  color: blue;',
    '}'
  ].join('\n')
  equal(jss.sheets.toString(), css, 'returns CSS of all sheets')
})

test('.createRule()', () => {
  let passedRule
  jss.use(rule => {
    passedRule = rule
  })
  const rule = jss.createRule()
  ok(rule instanceof Rule, 'returns a Rule instance')
  strictEqual(rule, passedRule, 'called plugins and passed the rule')
})

test('.use()', () => {
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

test('.version', () => {
  equal(jss.version, version, 'returns JSS version')
})
