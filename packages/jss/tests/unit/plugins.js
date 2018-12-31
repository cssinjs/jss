import expect from 'expect.js'
import {plugins} from '../../src/plugins'
import plugin from '../../src/plugins/styleRule'
import {resetSheets} from '../../../../tests/utils'

describe('Unit: jss - plugins', () => {
  beforeEach(resetSheets())

  describe('First plugin should be style rule for perf opt', () => {
    it('should export StyleRule as a first entry', () => {
      expect(plugins[0]).to.be(plugin)
    })
  })
})
