import expect from 'expect.js'
import escape from '../../src/utils/escape'

describe('Unit: jss - escape', () => {
  describe('with CSS.escape', () => {
    it('should escape in development', () => {
      expect(escape('test()')).to.be('test\\(\\)')
    })

    it('should not escape in production', () => {
      process.env.NODE_ENV = 'production'
      expect(escape('test()')).to.be('test()')
      process.env.NODE_ENV = 'development'
    })
  })
})
