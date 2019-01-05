/* eslint-disable global-require, react/prop-types */

import expect from 'expect.js'
import React from 'react'
import {stripIndent} from 'common-tags'
import {create} from 'jss'
import TestRenderer from 'react-test-renderer'

import {renderToString} from 'react-dom/server'

import injectSheet, {SheetsRegistry, JssProvider} from '.'

const createGenerateId = () => {
  let counter = 0
  return rule => `${rule.key}-${counter++}`
}

describe('React-JSS: JssProvider', () => {
  describe('nested child JssProvider', () => {
    describe('generateId prop', () => {
      it('should forward from context', () => {
        const generateId = () => 'a'
        const registry = new SheetsRegistry()
        const MyComponent = injectSheet({a: {color: 'red'}})()

        TestRenderer.create(
          <JssProvider generateId={generateId}>
            <JssProvider registry={registry}>
              <MyComponent />
            </JssProvider>
          </JssProvider>
        )

        expect(registry.toString()).to.be(stripIndent`
          .a {
            color: red;
          }
        `)
      })

      it('should overwrite over child props', () => {
        const generateIdParent = () => 'a'
        const generateIdChild = () => 'b'
        const registry = new SheetsRegistry()
        const MyComponent = injectSheet({a: {color: 'red'}})()

        TestRenderer.create(
          <JssProvider generateId={generateIdParent}>
            <JssProvider generateId={generateIdChild} registry={registry}>
              <MyComponent />
            </JssProvider>
          </JssProvider>
        )

        expect(registry.toString()).to.be(stripIndent`
          .b {
            color: red;
          }
        `)
      })
    })

    describe('classNamePrefix prop', () => {
      it('should forward from context', () => {
        const generateId = (rule, sheet) => sheet.options.classNamePrefix + rule.key
        const registry = new SheetsRegistry()
        const MyComponent = injectSheet({a: {color: 'red'}})()

        const renderer = TestRenderer.create(
          <JssProvider classNamePrefix="A-">
            <JssProvider registry={registry} generateId={generateId}>
              <MyComponent />
            </JssProvider>
          </JssProvider>
        )

        expect(registry.toString()).to.be(stripIndent`
          .A-NoRenderer-a {
            color: red;
          }
        `)

        renderer.unmount()
      })

      it('should merge with child props', () => {
        const generateId = (rule, sheet) => sheet.options.classNamePrefix + rule.key
        const registry = new SheetsRegistry()
        const MyComponent = injectSheet({a: {color: 'red'}})()

        const renderer = TestRenderer.create(
          <JssProvider classNamePrefix="A-">
            <JssProvider classNamePrefix="B-" registry={registry} generateId={generateId}>
              <MyComponent />
            </JssProvider>
          </JssProvider>
        )

        expect(registry.toString()).to.be(stripIndent`
          .A-B-NoRenderer-a {
            color: red;
          }
        `)

        renderer.unmount()
      })
    })

    describe('jss prop', () => {
      it('should forward from context', () => {
        const localJss = create()
        const MyComponent = injectSheet({})()

        TestRenderer.create(
          <JssProvider jss={localJss}>
            <JssProvider>
              <MyComponent />
            </JssProvider>
          </JssProvider>
        )
      })

      it('should overwrite over child props', () => {
        const localJss1 = create()
        const localJss2 = create()
        const MyComponent = injectSheet({})()

        TestRenderer.create(
          <JssProvider jss={localJss1}>
            <JssProvider jss={localJss2}>
              <MyComponent />
            </JssProvider>
          </JssProvider>
        )
      })
    })

    describe('registry prop', () => {
      it('should forward from context', () => {
        const generateId = () => 'a'
        const registry = new SheetsRegistry()
        const MyComponent = injectSheet({a: {color: 'red'}})()

        TestRenderer.create(
          <JssProvider registry={registry}>
            <JssProvider generateId={generateId}>
              <MyComponent />
            </JssProvider>
          </JssProvider>
        )

        expect(registry.toString()).to.be(stripIndent`
          .a {
            color: red;
          }
        `)
      })

      it('should overwrite over child props', () => {
        const generateId = () => 'a'
        const registryA = new SheetsRegistry()
        const registryB = new SheetsRegistry()
        const MyComponent = injectSheet({a: {color: 'red'}})()

        TestRenderer.create(
          <JssProvider registry={registryA}>
            <JssProvider registry={registryB} generateId={generateId}>
              <MyComponent />
            </JssProvider>
          </JssProvider>
        )

        expect(registryA.toString()).to.be('')
        expect(registryB.toString()).to.be(stripIndent`
          .a {
            color: red;
          }
        `)
      })
    })

    describe('disableStylesGeneration prop', () => {
      it('should forward from context', () => {
        const generateId = () => 'a'
        const registry = new SheetsRegistry()
        const MyComponent = injectSheet({a: {color: 'red'}})()

        TestRenderer.create(
          <JssProvider registry={registry} disableStylesGeneration>
            <JssProvider generateId={generateId}>
              <MyComponent />
            </JssProvider>
          </JssProvider>
        )

        expect(registry.toString()).to.be('')
      })

      it('should overwrite over child props', () => {
        const generateId = () => 'a'
        const registry = new SheetsRegistry()
        const MyComponent = injectSheet({a: {color: 'red'}})()

        TestRenderer.create(
          <JssProvider registry={registry} disableStylesGeneration>
            <JssProvider generateId={generateId} disableStylesGeneration={false}>
              <MyComponent />
            </JssProvider>
          </JssProvider>
        )

        expect(registry.toString()).to.be(stripIndent`
          .a {
            color: red;
          }
        `)
      })
    })
  })

  describe('JssProvider in a stateful component', () => {
    it('should not reset the class name generator', () => {
      const registry = new SheetsRegistry()
      const A = injectSheet({a: {color: 'red'}})()
      const B = injectSheet({a: {color: 'green'}})()
      const generateId = createGenerateId()

      function MyComponent(props) {
        const Inner = props.value ? A : B

        return (
          <JssProvider registry={registry} generateId={generateId}>
            <Inner />
          </JssProvider>
        )
      }

      const renderer = TestRenderer.create(<MyComponent value={false} />)
      // TODO: Does this make sense?
      expect(registry.toString()).to.be(stripIndent`
        .a-0 {
          color: green;
        }
      `)

      renderer.update(<MyComponent value />)
      expect(registry.toString()).to.be(stripIndent`
        .a-1 {
          color: red;
        }
      `)

      renderer.update(<MyComponent value={false} />)
      expect(registry.toString()).to.be(stripIndent`
        .a-0 {
          color: green;
        }
      `)

      renderer.update(<MyComponent value />)
      expect(registry.toString()).to.be(stripIndent`
        .a-1 {
          color: red;
        }
      `)
    })
  })

  describe('with JssProvider for SSR', () => {
    it('should reset the class generator counter', () => {
      const styles = {
        button: {
          color: 'red',
          border: ({border}) => border
        }
      }
      const MyComponent = injectSheet(styles)()

      let registry = new SheetsRegistry()
      let generateId = createGenerateId()

      renderToString(
        <JssProvider registry={registry} generateId={generateId}>
          <MyComponent border="green" />
        </JssProvider>
      )

      expect(registry.toString()).to.equal(stripIndent`
        .button-0 {
          color: red;
        }
        .button-1 {
          border: green;
        }
      `)

      registry = new SheetsRegistry()
      generateId = createGenerateId()

      renderToString(
        <JssProvider registry={registry} generateId={generateId}>
          <MyComponent border="blue" />
        </JssProvider>
      )

      expect(registry.toString()).to.equal(stripIndent`
        .button-0 {
          color: red;
        }
        .button-1 {
          border: blue;
        }
      `)
    })

    it('should be idempotent', () => {
      let generateId = createGenerateId()
      const MyComponent = injectSheet({
        button: {
          color: props => props.color
        }
      })()

      const customSheets1 = new SheetsRegistry()
      const customSheets2 = new SheetsRegistry()

      renderToString(
        <JssProvider registry={customSheets1}>
          <MyComponent color="#000" />
        </JssProvider>
      )

      generateId = createGenerateId()

      renderToString(
        <JssProvider registry={customSheets2}>
          <MyComponent color="#000" />
        </JssProvider>
      )

      const result1 = customSheets1.toString()
      const result2 = customSheets2.toString()

      expect(result1).to.equal(result2)
    })

    it('should render deterministically on server and client', () => {
      let generateId = createGenerateId()
      const ComponentA = injectSheet({
        button: {
          color: props => props.color
        }
      })()

      const ComponentB = injectSheet({
        button: {
          color: props => props.color
        }
      })()

      const registry1 = new SheetsRegistry()
      const registry2 = new SheetsRegistry()

      renderToString(
        <JssProvider registry={registry1}>
          <ComponentA color="#000" />
        </JssProvider>
      )

      generateId = createGenerateId()

      TestRenderer.create(
        <JssProvider registry={registry2}>
          <ComponentB color="#000" />
        </JssProvider>
      )

      expect(registry1.toString()).to.equal(registry2.toString())
    })
  })
})
