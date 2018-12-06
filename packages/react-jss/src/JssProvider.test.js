/* eslint-disable global-require, react/prop-types */

import expect from 'expect.js'
import React, {Component} from 'react'
import {stripIndent} from 'common-tags'
import preset from 'jss-preset-default'
import {render, unmountComponentAtNode} from 'react-dom'
import {create} from 'jss'

import {renderToString} from 'react-dom/server'

import injectSheet, {SheetsRegistry, JssProvider} from '.'

const createGenerateId = () => {
  let counter = 0
  return rule => `${rule.key}-${counter++}`
}

describe('React-JSS: JssProvider', () => {
  let node

  beforeEach(() => {
    node = document.body.appendChild(document.createElement('div'))
  })

  afterEach(() => {
    unmountComponentAtNode(node)
    node.parentNode.removeChild(node)
  })

  describe('nested child JssProvider', () => {
    describe('generateId prop', () => {
      it('should forward from context', () => {
        const generateId = () => 'a'
        const registry = new SheetsRegistry()
        const MyComponent = injectSheet({a: {color: 'red'}})()

        render(
          <JssProvider generateId={generateId}>
            <JssProvider registry={registry}>
              <MyComponent />
            </JssProvider>
          </JssProvider>,
          node
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

        render(
          <JssProvider generateId={generateIdParent}>
            <JssProvider generateId={generateIdChild} registry={registry}>
              <MyComponent />
            </JssProvider>
          </JssProvider>,
          node
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

        render(
          <JssProvider classNamePrefix="A-">
            <JssProvider registry={registry} generateId={generateId}>
              <MyComponent />
            </JssProvider>
          </JssProvider>,
          node
        )

        expect(registry.toString()).to.be(stripIndent`
          .A-NoRenderer-a {
            color: red;
          }
        `)
      })

      it('should overwrite over child props', () => {
        const generateId = (rule, sheet) => sheet.options.classNamePrefix + rule.key
        const registry = new SheetsRegistry()
        const MyComponent = injectSheet({a: {color: 'red'}})()

        render(
          <JssProvider classNamePrefix="A-">
            <JssProvider classNamePrefix="B-" registry={registry} generateId={generateId}>
              <MyComponent />
            </JssProvider>
          </JssProvider>,
          node
        )

        expect(registry.toString()).to.be(stripIndent`
          .B-NoRenderer-a {
            color: red;
          }
        `)
      })
    })

    describe('jss prop', () => {
      it('should forward from context', () => {
        let processed = true
        const localJss = create().use({
          onProcessRule: () => {
            processed = true
          }
        })
        const MyComponent = injectSheet({a: {color: 'red'}})()

        render(
          <JssProvider jss={localJss}>
            <JssProvider>
              <MyComponent />
            </JssProvider>
          </JssProvider>,
          node
        )

        expect(processed).to.be(true)
      })

      it('should overwrite over child props', () => {
        let processed

        const localJss1 = create().use({
          onProcessRule: () => {
            processed = localJss1
          }
        })

        const localJss2 = create().use({
          onProcessRule: () => {
            processed = localJss2
          }
        })

        const MyComponent = injectSheet({a: {color: 'red'}})()

        render(
          <JssProvider jss={localJss1}>
            <JssProvider jss={localJss2}>
              <MyComponent />
            </JssProvider>
          </JssProvider>,
          node
        )

        expect(processed).to.be(localJss2)
      })
    })

    describe('registry prop', () => {
      it('should forward from context', () => {
        const generateId = () => 'a'
        const registry = new SheetsRegistry()
        const MyComponent = injectSheet({a: {color: 'red'}})()

        render(
          <JssProvider registry={registry}>
            <JssProvider generateId={generateId}>
              <MyComponent />
            </JssProvider>
          </JssProvider>,
          node
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

        render(
          <JssProvider registry={registryA}>
            <JssProvider registry={registryB} generateId={generateId}>
              <MyComponent />
            </JssProvider>
          </JssProvider>,
          node
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

        render(
          <JssProvider registry={registry} disableStylesGeneration>
            <JssProvider generateId={generateId}>
              <MyComponent />
            </JssProvider>
          </JssProvider>,
          node
        )

        expect(registry.toString()).to.be('')
      })

      it('should overwrite over child props', () => {
        const generateId = () => 'a'
        const registry = new SheetsRegistry()
        const MyComponent = injectSheet({a: {color: 'red'}})()

        render(
          <JssProvider registry={registry} disableStylesGeneration>
            <JssProvider generateId={generateId} disableStylesGeneration={false}>
              <MyComponent />
            </JssProvider>
          </JssProvider>,
          node
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
      const localJss = create({
        createGenerateId: () => {
          let counter = 0
          return rule => `${rule.key}-${counter++}`
        }
      })

      class MyComponent extends Component {
        value = true

        render() {
          this.value = !this.value
          const Inner = this.value ? A : B

          return (
            <JssProvider registry={registry} jss={localJss}>
              <Inner />
            </JssProvider>
          )
        }
      }

      render(<MyComponent />, node)
      // TODO: Does this make sense?
      expect(registry.toString()).to.be(stripIndent`
        .a-0 {
          color: green;
        }
      `)
      render(<MyComponent />, node)
      expect(registry.toString()).to.be(stripIndent`
        .a-1 {
          color: red;
        }
      `)
      render(<MyComponent />, node)
      expect(registry.toString()).to.be(stripIndent`
        .a-0 {
          color: green;
        }
      `)
      render(<MyComponent />, node)
      expect(registry.toString()).to.be(stripIndent`
        .a-1 {
          color: red;
        }
      `)
    })
  })

  describe('with JssProvider for SSR', () => {
    let localJss
    let generateId

    beforeEach(() => {
      localJss = create({
        ...preset(),
        virtual: true
      })

      generateId = createGenerateId()
    })

    it('should add style sheets to the registry from context', () => {
      const customSheets = new SheetsRegistry()
      const ComponentA = injectSheet({
        button: {color: 'red'}
      })()
      const ComponentB = injectSheet({
        button: {color: 'blue'}
      })()

      renderToString(
        <JssProvider registry={customSheets} jss={localJss}>
          <div>
            <ComponentA />
            <ComponentB />
          </div>
        </JssProvider>
      )

      expect(customSheets.registry.length).to.equal(2)
    })

    it('should use Jss instance from the context', () => {
      let receivedSheet

      const MyComponent = injectSheet({}, {inject: ['sheet']})(({sheet}) => {
        receivedSheet = sheet
        return null
      })

      renderToString(
        <JssProvider jss={localJss}>
          <MyComponent />
        </JssProvider>
      )

      expect(receivedSheet.options.jss).to.be(localJss)
    })

    it('should add dynamic sheets', () => {
      const customSheets = new SheetsRegistry()
      const MyComponent = injectSheet({
        button: {
          width: () => 10
        }
      })()

      renderToString(
        <JssProvider registry={customSheets} jss={localJss}>
          <MyComponent />
        </JssProvider>
      )

      expect(customSheets.registry.length).to.be(2)
    })

    it('should reset the class generator counter', () => {
      const styles = {
        button: {
          color: 'red',
          border: ({border}) => border
        }
      }
      const MyComponent = injectSheet(styles)()

      let registry = new SheetsRegistry()

      renderToString(
        <JssProvider registry={registry}>
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

      renderToString(
        <JssProvider registry={registry}>
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

      const customSheets1 = new SheetsRegistry()
      const customSheets2 = new SheetsRegistry()

      renderToString(
        <JssProvider registry={customSheets1}>
          <ComponentA color="#000" />
        </JssProvider>
      )

      render(
        <JssProvider registry={customSheets2}>
          <ComponentB color="#000" />
        </JssProvider>,
        node
      )

      expect(customSheets1.toString()).to.equal(customSheets2.toString())
    })

    it('should use generateId', () => {
      const Component1 = injectSheet({a: {color: 'red'}})()
      const Component2 = injectSheet({a: {color: 'red'}})()
      const registry = new SheetsRegistry()

      renderToString(
        <div>
          <JssProvider registry={registry} generateId={generateId}>
            <Component1 />
          </JssProvider>
          <JssProvider registry={registry} generateId={generateId}>
            <Component2 />
          </JssProvider>
        </div>
      )

      expect(registry.toString()).to.be(stripIndent`
        .a-0 {
          color: red;
        }
        .a-1 {
          color: red;
        }
      `)
    })

    it('should use classNamePrefix', () => {
      const MyRenderComponent = () => null
      const MyComponent = injectSheet({a: {color: 'red'}})(MyRenderComponent)
      const registry = new SheetsRegistry()
      const generateId2 = (rule, sheet) => `${sheet.options.classNamePrefix}${rule.key}`

      renderToString(
        <JssProvider registry={registry} generateId={generateId2} classNamePrefix="MyApp-">
          <MyComponent />
        </JssProvider>
      )

      expect(registry.toString()).to.be(stripIndent`
        .MyApp-MyRenderComponent-a {
          color: red;
        }
      `)
    })
  })
})
