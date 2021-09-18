/* eslint-disable global-require, react/prop-types, no-underscore-dangle */
/**
 * This tests are testing a base common behavior between HOC and hooks interfaces.
 */

import expect from 'expect.js'
import * as React from 'react'
import {spy} from 'sinon'
import TestRenderer from 'react-test-renderer'
import {renderToString} from 'react-dom/server'
import {stripIndent} from 'common-tags'

import {JssProvider, SheetsRegistry} from '../src'

export default ({createStyledComponent}) => {
  it('should work in StrictMode without error on React 16.3+', () => {
    const MyComponent = createStyledComponent({})

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

  it('should reuse one static sheet for many elements and detach sheet', () => {
    const registry = new SheetsRegistry()
    const MyComponent = createStyledComponent({
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

  it('should register style sheets when `renderToString`', () => {
    const registry = new SheetsRegistry()
    const MyComponent = createStyledComponent({
      button: {color: 'red'}
    })
    const generateId = () => 'id'
    renderToString(
      <JssProvider registry={registry} generateId={generateId}>
        <MyComponent />
      </JssProvider>
    )

    expect(registry.toString()).to.be(stripIndent`
      .id {
        color: red;
      }
    `)
  })

  it('should use passed options.generateId', () => {
    const registry = new SheetsRegistry()
    const options = {
      generateId: (rule) => `ui-${rule.key}`
    }
    const MyComponent = createStyledComponent(
      {
        button: {color: 'red'}
      },
      options
    )
    renderToString(
      <JssProvider registry={registry}>
        <MyComponent />
      </JssProvider>
    )
    expect(registry.toString()).to.be(stripIndent`
      .ui-button {
        color: red;
      }
    `)
  })

  describe('preserving source order', () => {
    let ComponentA
    let ComponentB
    let ComponentC
    let registry

    beforeEach(() => {
      registry = new SheetsRegistry()
      ComponentA = createStyledComponent({
        button: {color: 'red'}
      })
      ComponentB = createStyledComponent({
        button: {color: 'blue'}
      })
      ComponentC = createStyledComponent(
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

  describe('properly warn about themed styles misuse', () => {
    beforeEach(() => {
      spy(console, 'warn')
    })

    afterEach(() => {
      console.warn.restore()
    })

    it('warn if themed styles dont use theme', () => {
      const MyComponent = createStyledComponent(() => ({}), {name: 'Comp'})

      TestRenderer.act(() => {
        TestRenderer.create(<MyComponent theme={{}} />)
      })

      expect(
        console.warn.calledWithExactly(
          `Warning: [JSS] <Comp />'s styles function doesn't rely on the "theme" argument. We recommend declaring styles as an object instead.`
        )
      ).to.be(true)
    })

    it('should not warn if themed styles _do use_ theme', () => {
      const MyComponent = createStyledComponent((theme) => ({})) // eslint-disable-line no-unused-vars

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
      const MyComponent = createStyledComponent(
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
}
