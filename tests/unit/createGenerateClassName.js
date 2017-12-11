/* eslint-disable no-underscore-dangle */

import expect from 'expect.js'
import {createGenerateClassName} from '../../src'

const sheetMock = {
  options: {
    classNamePrefix: 'p',
    jss: {id: 0}
  }
}

describe('Unit: jss - createGenerateClassName', () => {
  it('should return a function', () => {
    expect(createGenerateClassName()).to.be.a(Function)
  })

  it('should generate a non-production class name', () => {
    const generate = createGenerateClassName()
    expect(generate({key: 'a'})).to.be('a-0-1')
  })

  it('should add prefix a non-production class name', () => {
    const generate = createGenerateClassName()
    expect(generate({key: 'a'}, sheetMock)).to.be('pa-0-0-1')
  })

  it('should increment jss lib version', () => {
    createGenerateClassName.__Rewire__('moduleId', 6)
    const generate = createGenerateClassName()
    expect(generate({key: 'a'})).to.be('a-6-1')
    createGenerateClassName.__ResetDependency__('moduleId')
  })

  it('should generate a production class name', () => {
    createGenerateClassName.__Rewire__('env', 'production')
    const generate = createGenerateClassName()
    expect(generate()).to.be('c01')
    createGenerateClassName.__ResetDependency__('env')
  })

  it('should add prefix a production class name', () => {
    createGenerateClassName.__Rewire__('env', 'production')
    const generate = createGenerateClassName()
    expect(generate({key: 'a'}, sheetMock)).to.be('p001')
    createGenerateClassName.__ResetDependency__('env')
  })
})
