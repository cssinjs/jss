/* eslint-disable no-underscore-dangle */

import expect from 'expect.js'
import {createGenerateId} from '../../src'
import {resetSheets, resetModuleId} from '../../../../tests/utils'

const sheetMock = {
  options: {
    classNamePrefix: 'p',
    jss: {id: 0}
  }
}

describe('Unit: jss - createGenerateId', () => {
  beforeEach(() => {
    resetSheets()
    resetModuleId()
  })

  it('should return a function', () => {
    expect(createGenerateId()).to.be.a(Function)
  })

  it('should generate a non-production class name', () => {
    const generate = createGenerateId()
    expect(generate({key: 'a'})).to.be('a-0-1')
  })

  it('should add prefix a non-production class name', () => {
    const generate = createGenerateId()
    expect(generate({key: 'a'}, sheetMock)).to.be('pa-0-0-1')
  })

  it.skip('should increment jss lib version', () => {
    const generate = createGenerateId()
    expect(generate({key: 'a'})).to.be('a-6-1')
  })

  it('should generate a minified class name', () => {
    const generate = createGenerateId({minify: true})
    expect(generate()).to.be('c01')
  })

  it('should add prefix a minified class name', () => {
    const generate = createGenerateId({minify: true})
    expect(generate({key: 'a'}, sheetMock)).to.be('p001')
  })
})
