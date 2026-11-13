import {describe, it, expect} from 'vitest'
import css, {create} from './index'

describe('css-jss: exports', () => {
  it('should have correct exports', () => {
    expect(css).toBeInstanceOf(Function)
    expect(create).toBeInstanceOf(Function)
  })
})
