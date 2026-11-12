import {describe, expect, it} from 'vitest'
import {plugins} from '../../src/plugins'
import plugin from '../../src/plugins/styleRule'

describe('Unit: jss - plugins', () => {
  describe('First plugin should be style rule for perf opt', () => {
    it('should export StyleRule as a first entry', () => {
      expect(plugins[0]).toBe(plugin)
    })
  })
})
