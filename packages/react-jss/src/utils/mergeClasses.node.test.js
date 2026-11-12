import {describe, expect, it} from 'vitest'
import compose from './mergeClasses'

describe('react-jss: merge-classes', () => {
  it('should merge two class objects', () => {
    const staticClasses = {
      a: 'a',
      b: 'b'
    }
    const dynamicClasses = {
      b: 'b2',
      c: 'c'
    }
    const composed = compose(staticClasses, dynamicClasses)
    expect(composed).toEqual({
      a: 'a',
      b: 'b b2',
      c: 'c'
    })
  })
})
