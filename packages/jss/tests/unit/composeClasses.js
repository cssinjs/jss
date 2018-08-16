import expect from 'expect.js'
import compose from '../../src/utils/composeClasses'

describe('compose', () => {
  it('should compose two class objects', () => {
    const classes1 = {
      a: 'a1',
      b: 'b1'
    }
    const classes2 = {
      b: 'b2',
      c: 'c2'
    }
    const composed = compose(
      classes1,
      classes2
    )

    expect(composed).to.eql({
      a: 'a1',
      b: 'b1 b2',
      c: 'c2'
    })
  })

  it('should compose three class objects', () => {
    const classes1 = {
      a: 'a1',
      b: 'b1',
      c: 'c1'
    }
    const classes2 = {
      b: 'b2',
      c: 'c2',
      d: 'd2'
    }
    const classes3 = {
      c: 'c3',
      d: 'd3',
      e: 'e3'
    }
    const composed = compose(
      classes1,
      classes2,
      classes3
    )

    expect(composed).to.eql({
      a: 'a1',
      b: 'b1 b2',
      c: 'c1 c2 c3',
      d: 'd2 d3',
      e: 'e3'
    })
  })
})
