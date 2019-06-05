/* eslint-disable global-require, react/prop-types, no-underscore-dangle */

import expect from 'expect.js'
import React from 'react'
import {spy} from 'sinon'
import TestRenderer from 'react-test-renderer'

import {JssProvider, SheetsRegistry} from '.'
import createUseStyles from './createUseStyles'

const createHookComp = (styles, options) => {
  const useStyles = createUseStyles(styles, options)

  const Comp = props => {
    useStyles(props)

    return null
  }

  return Comp
}

describe('React-JSS: createUseStyles', () => {
  it('should work in StrictMode without error on React 16.3+', () => {
    const MyComponent = createHookComp({})

    spy(console, 'error')

    TestRenderer.act(() => {
      TestRenderer.create(
        <React.StrictMode>
          <MyComponent />
        </React.StrictMode>
      )
    })

    expect(console.error.notCalled).to.be(true)

    console.error.restore()
  })

  describe('reusing style sheets', () => {
    it('should reuse one static sheet for many elements and detach sheet', () => {
      const registry = new SheetsRegistry()
      const MyComponent = createHookComp({
        button: {color: 'red'}
      })

      TestRenderer.act(() => {
        TestRenderer.create(
          <JssProvider registry={registry}>
            <MyComponent />
            <MyComponent />
            <MyComponent />
          </JssProvider>
        )
      })

      expect(registry.registry.length, 1)
    })
  })

  describe('.withStyles() preserving source order', () => {
    let ComponentA
    let ComponentB
    let ComponentC
    let registry

    beforeEach(() => {
      registry = new SheetsRegistry()
      ComponentA = createHookComp({
        button: {color: 'red'}
      })
      ComponentB = createHookComp({
        button: {color: 'blue'}
      })
      ComponentC = createHookComp(
        {
          button: {color: 'green'}
        },
        {index: 1234}
      )
    })

    it('should provide a default index in ascending order', () => {
      TestRenderer.act(() => {
        TestRenderer.create(
          <JssProvider registry={registry}>
            <ComponentA />
            <ComponentB />
          </JssProvider>
        )
      })

      expect(registry.registry.length).to.equal(2)
      const indexA = registry.registry[0].options.index
      const indexB = registry.registry[1].options.index

      expect(indexA).to.be.lessThan(indexB)
    })

    it('should not be affected by rendering order', () => {
      TestRenderer.act(() => {
        TestRenderer.create(
          <JssProvider registry={registry}>
            <ComponentB />
            <ComponentA />
          </JssProvider>
        )
      })

      expect(registry.registry.length).to.equal(2)
      const indexA = registry.registry[0].options.index
      const indexB = registry.registry[1].options.index

      expect(indexA).to.be.lessThan(indexB)
    })

    it('should keep custom index', () => {
      TestRenderer.act(() => {
        TestRenderer.create(
          <JssProvider registry={registry}>
            <ComponentC />
          </JssProvider>
        )
      })

      expect(registry.registry.length).to.equal(1)
      const indexC = registry.registry[0].options.index
      expect(indexC).to.equal(1234)
    })
  })

  describe('.withStyles() properly warns about themed styles misuse', () => {
    beforeEach(() => {
      spy(console, 'warn')
    })

    afterEach(() => {
      console.warn.restore()
    })

    it('warn if themed styles dont use theme', () => {
      const MyComponent = createHookComp(() => ({}))

      TestRenderer.act(() => {
        TestRenderer.create(<MyComponent theme={{}} />)
      })

      expect(
        console.warn.calledWithExactly(
          `Warning: [JSS] <Hook />'s styles function doesn't rely on the "theme" argument. We recommend declaring styles as an object instead.`
        )
      ).to.be(true)
    })

    it('should not warn if themed styles _do use_ theme', () => {
      const MyComponent = createHookComp(theme => ({})) // eslint-disable-line no-unused-vars

      TestRenderer.act(() => {
        TestRenderer.create(<MyComponent theme={{}} />)
      })

      expect(console.warn.called).to.be(false)
    })
  })

  describe('classNamePrefix', () => {
    let classNamePrefix
    const generateId = (rule, sheet) => {
      classNamePrefix = sheet.options.classNamePrefix
      return `${rule.key}-id`
    }

    const renderTest = (name = 'DisplayNameTest') => {
      const MyComponent = createHookComp(
        {
          a: {color: 'red'}
        },
        {name}
      )
      TestRenderer.act(() => {
        TestRenderer.create(
          <JssProvider generateId={generateId}>
            <MyComponent />
          </JssProvider>
        )
      })
    }

    it('should pass displayName as prefix', () => {
      renderTest()
      expect(classNamePrefix).to.be('DisplayNameTest-')
    })

    it('should handle spaces correctly', () => {
      renderTest('Display Name Test')
      expect(classNamePrefix).to.be('Display-Name-Test-')
    })
  })
})
