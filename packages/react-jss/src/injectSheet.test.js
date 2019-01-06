/* eslint-disable global-require, react/prop-types, no-underscore-dangle */

import expect from 'expect.js'
import React from 'react'
import {spy} from 'sinon'
import TestRenderer from 'react-test-renderer'

import injectSheet, {JssProvider, SheetsRegistry} from '.'

describe('React-JSS: injectSheet', () => {
  it('should work in StrictMode without error on React 16.3+', () => {
    const MyComponent = injectSheet({})()

    spy(console, 'error')

    TestRenderer.create(
      <React.StrictMode>
        <MyComponent />
      </React.StrictMode>
    )

    expect(console.error.notCalled).to.be(true)

    console.error.restore()
  })

  describe('reusing style sheets', () => {
    it('should reuse one static sheet for many elements and detach sheet', () => {
      const registry = new SheetsRegistry()
      const MyComponent = injectSheet({
        button: {color: 'red'}
      })()

      TestRenderer.create(
        <JssProvider registry={registry}>
          <MyComponent />
          <MyComponent />
          <MyComponent />
        </JssProvider>
      )

      expect(registry.registry.length, 1)
    })
  })

  describe('.injectSheet() preserving source order', () => {
    let ComponentA
    let ComponentB
    let ComponentC
    let registry

    beforeEach(() => {
      registry = new SheetsRegistry()
      ComponentA = injectSheet({
        button: {color: 'red'}
      })()
      ComponentB = injectSheet({
        button: {color: 'blue'}
      })()
      ComponentC = injectSheet(
        {
          button: {color: 'green'}
        },
        {index: 1234}
      )()
    })

    it('should provide a default index in ascending order', () => {
      TestRenderer.create(
        <JssProvider registry={registry}>
          <ComponentA />
          <ComponentB />
        </JssProvider>
      )

      expect(registry.registry.length).to.equal(2)
      const indexA = registry.registry[0].options.index
      const indexB = registry.registry[1].options.index

      expect(indexA).to.be.lessThan(0)
      expect(indexB).to.be.lessThan(0)
      expect(indexA).to.be.lessThan(indexB)
    })

    it('should not be affected by rendering order', () => {
      TestRenderer.create(
        <JssProvider registry={registry}>
          <ComponentB />
          <ComponentA />
        </JssProvider>
      )

      expect(registry.registry.length).to.equal(2)
      const indexA = registry.registry[0].options.index
      const indexB = registry.registry[1].options.index

      expect(indexA).to.be.lessThan(0)
      expect(indexB).to.be.lessThan(0)
      expect(indexA).to.be.lessThan(indexB)
    })

    it('should keep custom index', () => {
      TestRenderer.create(
        <JssProvider registry={registry}>
          <ComponentC />
        </JssProvider>
      )
      expect(registry.registry.length).to.equal(1)
      const indexC = registry.registry[0].options.index
      expect(indexC).to.equal(1234)
    })
  })

  // TODO: Merge classes tests

  describe('should merge the classes', () => {})

  describe('access inner component', () => {
    it('should be exposed using "InnerComponent" property', () => {
      const Comp = () => null
      const ComponentOuter = injectSheet({
        button: {color: 'red'}
      })(Comp)

      expect(ComponentOuter.InnerComponent).to.be(Comp)
    })
  })

  describe('access inner element', () => {
    it('should provide a ref to the inner element', () => {
      const innerRef = spy()

      /* eslint-disable-next-line react/no-multi-comp, react/prefer-stateless-function */
      class InnerComponent extends React.PureComponent {
        render() {
          return <div />
        }
      }

      const StyledComponent = injectSheet()(InnerComponent)
      TestRenderer.create(<StyledComponent ref={innerRef} />)

      expect(innerRef.callCount).to.be(1)
    })
  })

  describe('classNamePrefix', () => {
    let classNamePrefix
    const generateId = (rule, sheet) => {
      classNamePrefix = sheet.options.classNamePrefix
      return `${rule.key}-id`
    }

    const renderTest = () => {
      function DisplayNameTest() {
        return null
      }
      const MyComponent = injectSheet({
        a: {color: 'red'}
      })(DisplayNameTest)
      TestRenderer.create(
        <JssProvider generateId={generateId}>
          <MyComponent />
        </JssProvider>
      )
    }

    it('should pass displayName as prefix', () => {
      renderTest()
      expect(classNamePrefix).to.be('DisplayNameTest-')
    })

    it('should pass no prefix in production', () => {
      process.env.NODE_ENV = 'production'
      renderTest()
      expect(classNamePrefix).to.be('')
      process.env.NODE_ENV = 'development'
    })
  })
})
