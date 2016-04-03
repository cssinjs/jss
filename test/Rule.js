import jss from '../src'

QUnit.module('Rule')

test('create empty instance', () => {
  jss.uid.reset()
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
  equal(rule.className, undefined)
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
  equal(rule.toString(), '@keyframes id {\n  from {\n    top: 0;\n  }\n  30% {\n    top: 30;\n  }\n  60%, 70% {\n    top: 80;\n  }\n}')
})

test('@media', () => {
  const rule = jss.createRule('@media print', {button: {display: 'none'}}, {named: false})
  equal(rule.type, 'conditional')
  equal(rule.selector, '@media print')
  equal(rule.toString(), '@media print {\n  button {\n    display: none;\n  }\n}')
})

test('@media named', () => {
  jss.uid.reset()
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
  jss.uid.reset()
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
  equal(rule.type, 'regular')
  equal(rule.selector, '@font-face')
  equal(rule.toString(), '@font-face {\n  font-family: MyHelvetica;\n  src: local("Helvetica");\n}')
  rule = jss.createRule('@font-face', {
    'font-family': 'MyHelvetica',
    src: 'local("Helvetica")'
  }, {named: true})
  equal(rule.toString(), '@font-face {\n  font-family: MyHelvetica;\n  src: local("Helvetica");\n}')
})

test('@supports', () => {
  jss.uid.reset()
  const rule = jss.createRule('@supports ( display: flexbox )', {
    button: {
      display: 'none'
    }
  })
  equal(rule.type, 'conditional')
  equal(rule.selector, '@supports ( display: flexbox )')
  equal(rule.toString(), '@supports ( display: flexbox ) {\n  .button--jss-0-1 {\n    display: none;\n  }\n}')
})

test('applyTo', () => {
  const div = document.createElement('div')
  jss.createRule({
    float: 'left'
  }).applyTo(div)
  equal(div.style.float, 'left')

  jss.createRule({
    display: ['inline', 'something-unsupported']
  }).applyTo(div)
  equal(div.style.display, 'inline')
})

test('toJSON', () => {
  const decl = {color: 'red'}
  const rule = jss.createRule(decl)
  deepEqual(rule.toJSON(), decl, 'declarations are correct')
})

test('toJSON with nested rules', () => {
  const decl = {color: 'red', '&:hover': {color: 'blue'}}
  const rule = jss.createRule(decl)
  deepEqual(rule.toJSON(), {color: 'red'}, 'nested rules removed')
})

test('set/get rules virtual prop', () => {
  const rule = jss.createRule()
  rule.prop('float', 'left')
  equal(rule.prop('float'), 'left')
})

test('set/get rules virtual prop with value 0', () => {
  const rule = jss.createRule()
  rule.prop('width', 0)
  equal(rule.prop('width'), 0)
})

test('set/get rules dom prop', () => {
  const sheet = jss.createStyleSheet({a: {float: 'left'}}, {link: true})
  const rule = sheet.rules.a
  sheet.attach()
  rule.prop('color', 'red')
  equal(rule.style.color, 'red', 'new prop is cached')
  equal(rule.prop('color'), 'red', 'new prop is returned')
  equal(rule.renderable.style.color, 'red', 'new rule is set to the DOM')
  sheet.detach()
})

test('get rules prop from the dom and cache it', () => {
  const sheet = jss.createStyleSheet({a: {float: 'left'}}, {link: true})
  const rule = sheet.rules.a
  sheet.attach()
  equal(rule.prop('color'), '', 'color is empty')
  ok('color' in rule.style, 'value is cached')
  sheet.detach()
})

test('run plugins on inner rules of an conditional rule', () => {
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

test('run plugins on inner rules of a keyframe rule', () => {
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
