/* eslint-disable no-underscore-dangle */

import expect from 'expect.js'
import {createGenerateClassName} from '../../src'

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
    expect(generate({key: 'a'}, {options: {classNamePrefix: 'p'}})).to.be('pa-0-1')
  })

  it('should increment jss lib version', () => {
    createGenerateClassName.__Rewire__('jssCounter', 6)
    const generate = createGenerateClassName()
    expect(generate({key: 'a'})).to.be('a-6-1')
    createGenerateClassName.__ResetDependency__('jssCounter')
  })

  it('should generate a production class name', () => {
    createGenerateClassName.__Rewire__('env', 'production')
    const generate = createGenerateClassName()
    expect(generate()).to.be('c01')
    createGenerateClassName.__ResetDependency__('env')
  })

  it('should escape class name', () => {
    const generate = createGenerateClassName()
    expect(generate({key: 'a('}, {options: {classNamePrefix: 'p)'}})).to.be('p\\)a\\(-0-1')
  })

  it('should warn when CSS.escape is not available', () => {
    if (CSS && CSS.escape) return
    let warned
    createGenerateClassName.__Rewire__('warning', () => {
      warned = true
    })
    const generate = createGenerateClassName()
    generate({key: 'a'})
    expect(warned).to.be(true)
    createGenerateClassName.__ResetDependency__('warning')
  })
})
