import expect from 'expect.js'
import Jss from '../../src/Jss'
import StyleSheet from '../../src/StyleSheet'
import PluginsRegistry from '../../src/PluginsRegistry'
import sheets from '../../src/sheets'
import DomRenderer from '../../src/DomRenderer'
import {resetSheets} from '../../../../tests/utils'

describe('Unit: jss', () => {
  let jss

  beforeEach(resetSheets())

  beforeEach(() => {
    jss = new Jss()
  })

  describe('Instance', () => {
    it('should be correct', () => {
      expect(jss).to.be.a(Jss)
    })

    it('should have an id', () => {
      expect(jss.id).to.be.a('number')
    })

    it('should have .plugins registry instance', () => {
      expect(jss.plugins).to.be.a(PluginsRegistry)
    })

    it('should provide .version prop', () => {
      expect(jss.version).to.be.a('string')
    })

    it('should provide .generateId method', () => {
      expect(jss.generateId).to.be.a(Function)
    })

    it('should have correct .options', () => {
      expect(jss.options).to.be.an(Object)
      expect(jss.options.createGenerateId).to.be.a(Function)
      expect(jss.options.Renderer).to.be(DomRenderer)
      expect(jss.options.plugins).to.be.an(Array)
    })
  })

  describe('.setup()', () => {
    it('should setup generateId', () => {
      const generateId = () => null
      const createGenerateId = () => generateId
      jss.setup({createGenerateId})
      expect(jss.options.createGenerateId).to.be(createGenerateId)
      expect(jss.generateId).to.be(generateId)
    })

    it('should setup insertionPoint', () => {
      jss.setup({insertionPoint: 'test'})
      expect(jss.options.insertionPoint).to.be('test')
    })

    it('should setup custom Renderer', () => {
      class Renderer {}
      jss.setup({Renderer})
      expect(jss.options.Renderer).to.be(Renderer)
    })

    it('should setup without Renderer', () => {
      jss.setup({Renderer: null})
      expect(jss.options.Renderer).to.be(null)
    })

    it('should setup plugins', () => {
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
      jss.setup({
        plugins: [plugin1, plugin2]
      })

      jss.createRule()
      expect(p1).to.be(true)
      expect(p2).to.be(true)
      expect(c2).to.be(true)
    })

    it('should apply same plugin only once by ref', () => {
      let called = 0
      const plugin = {
        onCreateRule: () => {
          called++
        }
      }
      jss.setup({plugins: [plugin, plugin]})
      jss.createRule()
      expect(called).to.be(1)
    })
  })

  describe('.createStyleSheet()', () => {
    it('should create a sheet', () => {
      expect(jss.createStyleSheet()).to.be.a(StyleSheet)
    })
  })

  describe('.removeStyleSheet()', () => {
    it('should remove a sheet', () => {
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

  describe('.use()', () => {
    let used
    const plugin = {}

    beforeEach(() => {
      jss.plugins.use = (receivedPlugin) => {
        used = receivedPlugin
      }
      jss.use(plugin)
    })

    it('should use a plugin', () => {
      expect(used).to.be(plugin)
    })
  })
})
