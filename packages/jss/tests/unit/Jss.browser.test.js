import {beforeEach, describe, expect, it} from 'vitest'
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
      expect(jss).toBeInstanceOf(Jss)
    })

    it('should have an id', () => {
      expect(jss.id).toBeTypeOf('number')
    })

    it('should have .plugins registry instance', () => {
      expect(jss.plugins).toBeInstanceOf(PluginsRegistry)
    })

    it('should provide .version prop', () => {
      expect(jss.version).toBeTypeOf('string')
    })

    it('should provide .generateId method', () => {
      expect(jss.generateId).toBeInstanceOf(Function)
    })

    it('should have correct .options', () => {
      expect(jss.options).toBeInstanceOf(Object)
      expect(jss.options.createGenerateId).toBeInstanceOf(Function)
      expect(jss.options.Renderer).toBe(DomRenderer)
      expect(jss.options.plugins).toBeInstanceOf(Array)
    })
  })

  describe('.setup()', () => {
    it('should setup generateId', () => {
      const generateId = () => null
      const createGenerateId = () => generateId
      jss.setup({createGenerateId})
      expect(jss.options.createGenerateId).toBe(createGenerateId)
      expect(jss.generateId).toBe(generateId)
    })

    it('should setup insertionPoint', () => {
      jss.setup({insertionPoint: 'test'})
      expect(jss.options.insertionPoint).toBe('test')
    })

    it('should setup custom Renderer', () => {
      class Renderer {}
      jss.setup({Renderer})
      expect(jss.options.Renderer).toBe(Renderer)
    })

    it('should setup without Renderer', () => {
      jss.setup({Renderer: null})
      expect(jss.options.Renderer).toBe(null)
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
      expect(p1).toBe(true)
      expect(p2).toBe(true)
      expect(c2).toBe(true)
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
      expect(called).toBe(1)
    })
  })

  describe('.createStyleSheet()', () => {
    it('should create a sheet', () => {
      expect(jss.createStyleSheet()).toBeInstanceOf(StyleSheet)
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
      expect(detached).toBe(true)
      expect(sheets.registry.indexOf(sheet)).toBe(-1)
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
      expect(used).toBe(plugin)
    })
  })
})
