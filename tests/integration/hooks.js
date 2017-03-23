import expect from 'expect.js'
import {stripIndent} from 'common-tags'
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
      jss.use({
        onProcessRule: (rule) => {
          if (rule.name === 'a') {
            rule.options.sheet.addRule('b', {color: 'green'}, {index: 1})
          }
        }
      })

      const classNames = []
      jss.use({
        onProcessRule: (rule) => {
          classNames.push(rule.className)
        }
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
      jss.use({
        onProcessRule: (rule, sheet) => {
          receivedRule = rule
          receivedSheet = sheet
          executed++
        }
      })
      const sheet = jss.createStyleSheet({
        a: {color: 'red'}
      })
      expect(sheet).to.be(receivedSheet)
      expect(sheet.getRule('a')).to.be(receivedRule)
      expect(executed).to.be(1)
    })

    it('should detect styles mutation', () => {
      jss.use({
        onProcessRule: (rule) => {
          rule.style.border.color = 'green'
        }
      })
      expect(() => {
        jss.createStyleSheet({
          a: {
            border: {
              color: 'red'
            }
          }
        })
      }).to.throwException()
    })
  })

  describe('onCreateRule', () => {
    it('should pass right arguments', () => {
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
    it('should pass right arguments', () => {
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
      jss.use({
        onProcessRule: (rule) => {
          receivedRule = rule
          executed++
        }
      })
      const rule = jss.createRule()
      expect(rule).to.be(receivedRule)
      expect(executed).to.be(1)
    })

    it('should run plugins on @media rule', () => {
      let executed = 0
      jss.use({onProcessRule: () => executed++})
      jss.createRule('@media', {
        button: {float: 'left'}
      })
      expect(executed).to.be(2)
    })

    it('should run plugins on @keyframes rule', () => {
      let executed = 0
      jss.use({onProcessRule: () => executed++})
      jss.createRule('@keyframes', {
        from: {top: 0},
        to: {top: 10}
      })
      expect(executed).to.be(3)
    })

    it('should accept multiple plugins', () => {
      let receivedRule1
      let receivedRule2
      const plugin1 = {
        onProcessRule: (rule) => {
          receivedRule1 = rule
        }
      }
      const plugin2 = {
        onProcessRule: (rule) => {
          receivedRule2 = rule
        }
      }
      jss.use(plugin1, plugin2)
      const rule = jss.createRule()
      expect(receivedRule1).to.be(rule)
      expect(receivedRule2).to.be(rule)
    })
  })

  describe('onChangeValue', () => {
    let receivedValue
    let receivedProp
    let receivedRule
    let executed = 0
    let sheet

    beforeEach(() => {
      jss.use({
        onChangeValue: (value, prop, rule) => {
          receivedValue = value
          receivedProp = prop
          receivedRule = rule
          executed++
        }
      })
      sheet = jss.createStyleSheet({
        a: {color: 'red'}
      })
    })

    it('should receive correct arguments', () => {
      const rule = sheet.getRule('a')
      rule.prop('color', 'green')
      expect(executed).to.be(1)
      expect(receivedValue).to.be('green')
      expect(receivedProp).to.be('color')
      expect(receivedRule).to.be(rule)
    })

    it('should compile to correct CSS string', () => {
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
        }
      `)
      sheet.getRule('a').prop('color', 'green')
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: green;
        }
      `)
    })

    it('should pass the new value to the next hook', () => {
      jss.use({onChangeValue: value => `${value}-first`})
      jss.use({onChangeValue: value => `${value}-second`})
      sheet.getRule('a').prop('color', 'green')
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: green-first-second;
        }
      `)
    })
  })
})
