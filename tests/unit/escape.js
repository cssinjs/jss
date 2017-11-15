/* eslint-disable no-underscore-dangle */

import expect from 'expect.js'
import escape from '../../src/utils/escape'

const originalEscape = CSS.escape

describe('Unit: jss - escape', () => {
  describe('with CSS.escape', () => {
    it('should escape in development', () => {
      expect(escape('test()')).to.be('test\\(\\)')
    })

    it('should not escape in production', () => {
      escape.__Rewire__('env', 'production')
      expect(escape('test()')).to.be('test()')
      escape.__ResetDependency__('env')
    })
  })

  describe('without CSS.escape', () => {
    beforeEach(() => {
      delete CSS.escape
    })

    afterEach(() => {
      CSS.escape = originalEscape
    })

    it('should escape', () => {
      escape('test()')
      expect(escape('test()')).to.be('test\\(\\)')
    })
  })
})
