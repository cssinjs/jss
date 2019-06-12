// @flow
import expect from 'expect.js'
import css, {create} from './index'

describe('css-jss: exports', () => {
  it('should have correct exports', () => {
    expect(css).to.be.a(Function)
    expect(create).to.be.a(Function)
  })
})
