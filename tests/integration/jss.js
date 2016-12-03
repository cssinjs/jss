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
      const local = create()
      const plugin1 = () => {}
      const plugin2 = () => {}
      local.setup({
        plugins: [plugin1, plugin2]
      })
      expect(local.plugins.registry.pop().onProcessRule).to.be(plugin2)
      expect(local.plugins.registry.pop().onProcessRule).to.be(plugin1)
    })
  })

  describe('.use()', () => {
    describe('.createStyleSheet()', () => {
      it('should pass rule correctly', () => {
        let receivedRule
        let executed = 0
        jss.use((rule) => {
          receivedRule = rule
          executed++
        })
        const sheet = jss.createStyleSheet({
          a: {float: 'left'}
        })
        expect(sheet.getRule('a')).to.be(receivedRule)
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
        expect(jss.plugins.registry.length).to.be(9)
        expect(jss.plugins.registry[7].onProcessRule).to.be(plugin1)
        expect(jss.plugins.registry[8].onProcessRule).to.be(plugin2)
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
