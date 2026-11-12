/* eslint-disable no-underscore-dangle */

import {describe, expect, it, vi} from 'vitest'
import {createGenerateId} from '../../src'

// Browser ESM exports are read-only. Keep IDs deterministic without mutating them.
vi.mock('../../src/utils/moduleId', () => ({default: 0}))

const sheetMock = {
  options: {
    classNamePrefix: 'p',
    jss: {id: 0}
  }
}

describe('Unit: jss - createGenerateId', () => {
  it('should return a function', () => {
    expect(createGenerateId()).toBeInstanceOf(Function)
  })

  it('should generate a non-production class name', () => {
    const generate = createGenerateId()
    expect(generate({key: 'a'})).toBe('a-0-1')
  })

  it('should add prefix a non-production class name', () => {
    const generate = createGenerateId()
    expect(generate({key: 'a'}, sheetMock)).toBe('pa-0-0-1')
  })

  it.skip('should increment jss lib version', () => {
    const generate = createGenerateId()
    expect(generate({key: 'a'})).toBe('a-6-1')
  })

  it('should generate a minified class name', () => {
    const generate = createGenerateId({minify: true})
    expect(generate()).toBe('c01')
  })

  it('should add prefix a minified class name', () => {
    const generate = createGenerateId({minify: true})
    expect(generate({key: 'a'}, sheetMock)).toBe('p001')
  })
})
