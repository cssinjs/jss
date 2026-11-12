import {describe, expect, it} from 'vitest'
import escape from '../../src/utils/escape'

describe('Unit: jss - escape', () => {
  describe('without native CSS.escape', () => {
    it('should escape special characters', () => {
      expect(escape('test()')).toBe('test\\(\\)')
    })
  })
})
