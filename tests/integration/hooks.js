import expect from 'expect.js'
import {create} from '../../src'
import StyleSheet from '../../src/StyleSheet'
import {generateClassName} from '../utils'

describe('Integration: hooks', () => {
  let jss

  beforeEach(() => {
    jss = create({generateClassName})
  })

  describe('common', () => {
    it('should not call hooks twice on the same rule', () => {
      const styles = {a: {color: 'red'}}
      let receivedRule
      let processed = 0
      jss.use({
        onCreateRule: () => receivedRule,
        onProcessRule: (rule) => {
          receivedRule = rule
          processed++
        }
      })
      // Process rules once.
      jss.createStyleSheet(styles)
      jss.createStyleSheet(styles)
      expect(processed).to.be(1)
    })

    it('should call hooks in the correct order', () => {
      jss.use((rule) => {
        if (rule.name === 'a') {
          rule.options.sheet.addRule('b', {color: 'green'}, {index: 1})
        }
      })

      const classNames = []
      jss.use((rule) => {
        classNames.push(rule.className)
      })

      const sheet = jss.createStyleSheet({
        a: {color: 'red'},
        c: {color: 'blue'}
      })

      expect(sheet.indexOf(sheet.getRule('a'))).to.be(0)
      expect(sheet.indexOf(sheet.getRule('b'))).to.be(1)
      expect(sheet.indexOf(sheet.getRule('c'))).to.be(2)
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
        '  color: red;\n' +
        '}\n' +
        '.b-id {\n' +
        '  color: green;\n' +
        '}\n' +
        '.c-id {\n' +
        '  color: blue;\n' +
        '}'
      )
      expect(classNames).to.eql(['b-id', 'a-id', 'c-id'])
    })
  })

  describe('onProcessRule', () => {
    it('should pass right arguments', () => {
      let receivedRule
      let receivedSheet
      let executed = 0
      jss.use((rule, sheet) => {
        receivedRule = rule
        receivedSheet = sheet
        executed++
      })
      const sheet = jss.createStyleSheet({
        a: {float: 'left'}
      })
      expect(sheet).to.be(receivedSheet)
      expect(sheet.getRule('a')).to.be(receivedRule)
      expect(executed).to.be(1)
    })
  })

  describe('onCreateRule', () => {
    it('should pass right arguments to onCreateRule', () => {
      let receivedName
      let receivedDecl
      let receivedOptions
      let executed = 0
      jss.use({
        onCreateRule: (name, decl, options) => {
          receivedName = name
          receivedDecl = decl
          receivedOptions = options
          executed++
        }
      })
      jss.createStyleSheet({
        a: {float: 'left'}
      })
      expect(receivedName).to.be('a')
      expect(receivedDecl).to.eql({float: 'left'})
      expect(receivedOptions).to.be.an(Object)
      expect(executed).to.be(1)
    })
  })

  describe('onProcessSheet', () => {
    it('should pass right arguments to onProcessSheet', () => {
      let receivedSheet
      let executed = 0
      jss.use({
        onProcessSheet: (sheet) => {
          receivedSheet = sheet
          executed++
        }
      })
      jss.createStyleSheet({
        a: {float: 'left'}
      })
      expect(receivedSheet).to.be.a(StyleSheet)
      expect(executed).to.be(1)
    })
  })

  describe('.createRule() with onProcessRule', () => {
    it('should pass rule correctly', () => {
      let receivedRule
      let executed = 0
      jss.use((rule) => {
        receivedRule = rule
        executed++
      })
      const rule = jss.createRule()
      expect(rule).to.be(receivedRule)
      expect(executed).to.be(1)
    })

    it('should run plugins on @media rule', () => {
      let executed = 0
      jss.use(() => executed++)
      jss.createRule('@media', {
        button: {float: 'left'}
      })
      expect(executed).to.be(2)
    })

    it('should run plugins on @keyframes rule', () => {
      let executed = 0
      jss.use(() => executed++)
      jss.createRule('@keyframes', {
        from: {top: 0},
        to: {top: 10}
      })
      expect(executed).to.be(3)
    })

    it('should accept multiple plugins', () => {
      let receivedRule1
      let receivedRule2
      const plugin1 = (rule) => {
        receivedRule1 = rule
      }
      const plugin2 = (rule) => {
        receivedRule2 = rule
      }
      jss.use(plugin1, plugin2)
      const rule = jss.createRule()
      expect(receivedRule1).to.be(rule)
      expect(receivedRule2).to.be(rule)
    })
  })
})
