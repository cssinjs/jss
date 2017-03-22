import expect from 'expect.js'
import cloneStyle from '../../src/utils/cloneStyle'

describe('Unit: jss - cloneStyle', () => {
  it('should return a shallow cloned object', () => {
    const style = {color: 'red'}
    const clonedStyle = cloneStyle(style)
    expect(clonedStyle).not.to.be(style)
    expect(clonedStyle).to.eql(style)
  })

  it('should skip function values', () => {
    const style = {width: () => null, color: 'red'}
    const clonedStyle = cloneStyle(style)
    expect(clonedStyle).not.to.be(style)
    expect(clonedStyle).to.eql({color: 'red'})
  })
})
