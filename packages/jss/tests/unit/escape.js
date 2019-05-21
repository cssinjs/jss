import expect from 'expect.js'
import escape from '../../src/utils/escape'

describe('Unit: jss - escape', () => {
  describe('with CSS.escape', () => {
    it('should escape in development', () => {
      expect(escape('test()')).to.be('test\\(\\)')
    })
  })
})
