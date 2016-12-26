import expect from 'expect.js'
import {create, sheets} from '../../src'
import Jss from '../../src/Jss'
import StyleSheet from '../../src/StyleSheet'
import PluginsRegistry from '../../src/PluginsRegistry'

describe('Integration: jss', () => {
  let jss

  beforeEach(() => {
    jss = create()
  })

  describe('exports', () => {
    it('should export default Jss instance', () => {
      expect(jss).to.be.a(Jss)
    })

    it('should export create function', () => {
      expect(create).to.be.a(Function)
    })

    it('should have .plugins registry instance', () => {
      expect(jss.plugins).to.be.a(PluginsRegistry)
    })

    it('should provide .version prop', () => {
      expect(jss.version).to.be.a('string')
    })

    it('should have correct .options', () => {
      expect(jss.options).to.be.an(Object)
      expect(jss.options.generateClassName).to.be.a(Function)
    })
  })

  describe('.create()', () => {
    it('should create a Jss instance', () => {
      expect(create()).to.be.a(Jss)
    })
  })

  describe('.setup()', () => {
    it('should set up plugins', () => {
      const jss2 = create()
      let p1 = false
      let c2 = false
      let p2 = false

      const plugin1 = () => {
        p1 = true
      }
      const plugin2 = {
        onCreateRule: () => {
          c2 = true
        },
        onProcessRule: () => {
          p2 = true
        }
      }
      jss2.setup({
        plugins: [plugin1, plugin2]
      })

      jss2.createRule()
      expect(p1).to.be(true)
      expect(p2).to.be(true)
      expect(c2).to.be(true)
    })
  })

  describe('.use()', () => {
    describe('.createStyleSheet()', () => {
      it('should pass right arguments to onProcessRule', () => {
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

    describe('.createRule()', () => {
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

  describe('.createStyleSheet()', () => {
    it('should create a sheet', () => {
      expect(jss.createStyleSheet()).to.be.a(StyleSheet)
    })
  })

  describe('.removeStyleSheet()', () => {
    it('should remove', () => {
      let detached
      const sheet = jss.createStyleSheet()
      sheet.detach = () => {
        detached = true
      }
      jss.removeStyleSheet(sheet)
      expect(detached).to.be(true)
      expect(sheets.registry.indexOf(sheet)).to.be(-1)
    })
  })
})
