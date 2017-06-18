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
      expect(jss.options.createGenerateClassName).to.be.a(Function)
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

      const plugin1 = {
        onProcessRule: () => {
          p1 = true
        }
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
