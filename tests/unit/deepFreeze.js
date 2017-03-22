/* eslint-disable no-underscore-dangle, strict */

import expect from 'expect.js'
import deepFreeze from '../../src/utils/deepFreeze'

describe('Unit: jss - deepFreeze', () => {
  it('should be a noop on non object values', () => {
    global.__DEV__ = true
    expect(() => deepFreeze('')).to.not.throwException()
    expect(() => deepFreeze(null)).to.not.throwException()
    expect(() => deepFreeze(false)).to.not.throwException()
    expect(() => deepFreeze(5)).to.not.throwException()
    expect(() => deepFreeze()).to.not.throwException()
    global.__DEV__ = false
    expect(() => deepFreeze('')).to.not.throwException()
    expect(() => deepFreeze(null)).to.not.throwException()
    expect(() => deepFreeze(false)).to.not.throwException()
    expect(() => deepFreeze(5)).to.not.throwException()
    expect(() => deepFreeze()).to.not.throwException()
  })

  it('should throw on mutation in dev with strict', () => {
    'use strict'

    global.__DEV__ = true
    const o = {key: 'oldValue'}
    deepFreeze(o)
    expect(() => {
      o.key = 'newValue'
    }).to.throwException(
      'You attempted to set the key `key` with the value `"newValue"` ' +
      'on an object that is meant to be immutable and has been frozen.'
    )
    expect(o.key).to.be('oldValue')
  })

  it('should throw on mutation in dev without strict', () => {
    global.__DEV__ = true
    const o = {key: 'oldValue'}
    deepFreeze(o)
    expect(() => {
      o.key = 'newValue'
    }).to.throwException(
      'You attempted to set the key `key` with the value `"newValue"` ' +
      'on an object that is meant to be immutable and has been frozen.'
    )
    expect(o.key).to.be('oldValue')
  })

  it('should throw on nested mutation in dev with strict', () => {
    'use strict'

    global.__DEV__ = true
    const o = {key1: {key2: {key3: 'oldValue'}}}
    deepFreeze(o)
    expect(() => {
      o.key1.key2.key3 = 'newValue'
    }).to.throwException(
      'You attempted to set the key `key3` with the value `"newValue"` ' +
      'on an object that is meant to be immutable and has been frozen.'
    )
    expect(o.key1.key2.key3).to.be('oldValue')
  })

  it('should throw on nested mutation in dev without strict', () => {
    global.__DEV__ = true
    const o = {key1: {key2: {key3: 'oldValue'}}}
    deepFreeze(o)
    expect(() => {
      o.key1.key2.key3 = 'newValue'
    }).to.throwException(
      'You attempted to set the key `key3` with the value `"newValue"` ' +
      'on an object that is meant to be immutable and has been frozen.'
    )
    expect(o.key1.key2.key3).to.be('oldValue')
  })

  it('should throw on insertion in dev with strict', () => {
    'use strict'

    global.__DEV__ = true
    const o = {oldKey: 'value'}
    deepFreeze(o)
    expect(() => {
      o.newKey = 'value'
    }).to.throwException('Can\'t add property newKey, object is not extensible')
    expect(o.newKey).to.be(undefined)
  })

  it('should mutate and not throw on mutation in prod', () => {
    'use strict'

    global.__DEV__ = false
    const o = {key: 'oldValue'}
    deepFreeze(o)
    expect(() => {
      o.key = 'newValue'
    }).to.not.throwException()
    expect(o.key).to.be('newValue')
  })

  it('should not deep freeze already frozen objects', () => {
    'use strict'

    global.__DEV__ = true
    const o = {key1: {key2: 'oldValue'}}
    Object.freeze(o)
    deepFreeze(o)
    expect(() => {
      o.key1.key2 = 'newValue'
    }).to.not.throwException()
    expect(o.key1.key2).to.be('newValue')
  })

  it('shouldn\'t recurse infinitely', () => {
    global.__DEV__ = true
    const o = {}
    o.circular = o
    deepFreeze(o)
  })
})
