import {describe, it} from 'vitest'
import expect from 'expect.js'
import escape from '../../src/utils/escape'

describe('Unit: jss - escape', () => {
  describe('without native CSS.escape', () => {
    it('should escape special characters', () => {
      expect(escape('test()')).to.be('test\\(\\)')
    })
  })
})
