import expect from 'expect.js'
import compose from './compose'

describe('compose', () => {
  it('should compose two class objects', () => {
    const staticClasses = {
      a: 'a',
      b: 'b'
    }
    const dynamicClasses = {
      b: 'b2',
      c: 'c'
    }
    const composed = compose(
      staticClasses,
      dynamicClasses
    )
    expect(composed).to.eql({
      a: 'a',
      b: 'b b2',
      c: 'c'
    })
  })
})
