/* eslint-disable no-underscore-dangle */

import expect from 'expect.js'
import {createGenerateId} from '../../src'
import {resetSheets} from '../../../../tests/utils'

const sheetMock = {
  options: {
    classNamePrefix: 'p',
    jss: {id: 0}
  }
}

describe('Unit: jss - createGenerateId', () => {
  beforeEach(resetSheets())

  it('should return a function', () => {
    expect(createGenerateId()).to.be.a(Function)
  })

  it('should generate a non-production class name', () => {
    const generate = createGenerateId()
    expect(generate({key: 'a'})).to.be('a-14-1')
  })

  it('should add prefix a non-production class name', () => {
    const generate = createGenerateId()
    expect(generate({key: 'a'}, sheetMock)).to.be('pa-14-0-1')
  })

  it.skip('should increment jss lib version', () => {
    const generate = createGenerateId()
    expect(generate({key: 'a'})).to.be('a-6-1')
  })

  it('should generate a production class name', () => {
    process.env.NODE_ENV = 'production'
    const generate = createGenerateId()
    expect(generate()).to.be('c141')
    process.env.NODE_ENV = 'development'
  })

  it('should add prefix a production class name', () => {
    process.env.NODE_ENV = 'production'
    const generate = createGenerateId()
    expect(generate({key: 'a'}, sheetMock)).to.be('p1401')
    process.env.NODE_ENV = 'development'
  })
})
