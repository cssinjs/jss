import jss from '../src'

QUnit.module('Jss')

test('default export', () => {
  equal(jss.constructor.name, 'Jss', 'is a Jss instance')
})

test('.create()', () => {
  equal(jss.create().constructor.name, 'Jss', 'returns a Jss instance')
})

test('.createStyleSheet()', () => {
  const sheet = jss.createStyleSheet()
  equal(sheet.constructor.name, 'StyleSheet', 'returns a StyleSheet instance')
  ok(jss.sheets.registry.indexOf(sheet) >= 0, 'adds sheet to sheets registry')
})

test('.sheets', () => {
  const sheet1 = jss.createStyleSheet({a: {color: 'red'}})
  const sheet2 = jss.createStyleSheet({a: {color: 'blue'}})

  ok(jss.sheets.registry.indexOf(sheet1) >= 0, 'adds sheet1 to sheets registry')
  ok(jss.sheets.registry.indexOf(sheet2) >= 0, 'adds sheet1 to sheets registry')
  equal(jss.sheets.toString(), '.a--jss-0-0 {\n  color: red;\n}\n.a--jss-0-1 {\n  color: blue;\n}', 'returns CSS of all sheets')
})

test('.createRule()', () => {
  let passedRule
  jss.use(rule => {
    passedRule = rule
  })
  const rule = jss.createRule()
  equal(rule.constructor.name, 'Rule', 'returns a Rule instance')
  strictEqual(rule, passedRule, 'called plugins and passed the rule')

  jss.plugins.registry = []
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

  jss.plugins.registry = []
})
