/* eslint-disable global-require, react/prop-types */

import expect from 'expect.js'
import * as React from 'react'
import {stripIndent} from 'common-tags'
import {create} from 'jss'
import TestRenderer from 'react-test-renderer'
import preset from 'jss-preset-default'

import {SheetsRegistry, JssProvider, withStyles} from '.'

const createGenerateId = () => {
  let counter = 0
  return (rule) => `${rule.key}-${counter++}`
}

describe('React-JSS: JssProvider', () => {
  let registry

  beforeEach(() => {
    registry = new SheetsRegistry()
  })

  describe('nested child JssProvider', () => {
    describe('generateId prop', () => {
      it('should forward from context', () => {
        const generateId = () => 'a'
        const MyComponent = withStyles({a: {color: 'red'}})()

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
        const MyComponent = withStyles({a: {color: 'red'}})()

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
      const generateId = (rule, sheet) => sheet.options.classNamePrefix + rule.key
      const MyComponent = withStyles({a: {color: 'red'}})()

      it('should merge with child props', () => {
        TestRenderer.create(
          <JssProvider classNamePrefix="A-" registry={registry} generateId={generateId}>
            <JssProvider classNamePrefix="B-">
              <MyComponent />
            </JssProvider>
          </JssProvider>
        )

        expect(registry.toString()).to.be(stripIndent`
          .A-B-NoRenderer-a {
            color: red;
          }
        `)
      })
    })

    describe('jss prop', () => {
      it('should forward from context', () => {
        const localJss = create()
        const MyComponent = withStyles({})()

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
        const MyComponent = withStyles({})()

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
        const MyComponent = withStyles({a: {color: 'red'}})()

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
        const MyComponent = withStyles({a: {color: 'red'}})()

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
        const MyComponent = withStyles({a: {color: 'red'}})()

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
        const MyComponent = withStyles({a: {color: 'red'}})()

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

    describe('id prop', () => {
      it('should forward from context', () => {
        const MyComponent = withStyles({a: {color: 'red'}})()

        TestRenderer.create(
          <JssProvider registry={registry} id={{minify: true}}>
            <JssProvider>
              <MyComponent />
            </JssProvider>
          </JssProvider>
        )
        expect(registry.toString().substr(0, 2)).to.be('.c')
      })

      it('should overwrite over child props to `true`', () => {
        const MyComponent = withStyles({a: {color: 'red'}})()

        TestRenderer.create(
          <JssProvider registry={registry} id={{minify: false}}>
            <JssProvider id={{minify: true}}>
              <MyComponent />
            </JssProvider>
          </JssProvider>
        )
        expect(registry.toString().substr(0, 2)).to.be('.c')
      })

      it('should overwrite over child props to `false`', () => {
        const MyComponent = withStyles({a: {color: 'red'}})()

        TestRenderer.create(
          <JssProvider registry={registry} id={{minify: true}}>
            <JssProvider id={{minify: false}}>
              <MyComponent />
            </JssProvider>
          </JssProvider>
        )

        expect(registry.toString().substr(0, 2)).to.be('.N')
      })

      it('should use generateId from context', () => {
        const generateId = () => 'a'
        const id = {minify: true}
        const MyComponent = withStyles({a: {color: 'red'}})()

        TestRenderer.create(
          <JssProvider registry={registry} generateId={generateId} id={id}>
            <MyComponent />
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
      const A = withStyles({a: {color: 'red'}})()
      const B = withStyles({a: {color: 'green'}})()
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
      // Filter detached sheets because there is no conditional rendering
      // on the server.
      expect(registry.toString({attached: true})).to.be(stripIndent`
        .a-0 {
          color: green;
        }
      `)

      renderer.update(<MyComponent value />)
      expect(registry.toString({attached: true})).to.be(stripIndent`
        .a-1 {
          color: red;
        }
      `)

      renderer.update(<MyComponent value={false} />)
      expect(registry.toString({attached: true})).to.be(stripIndent`
        .a-0 {
          color: green;
        }
      `)

      renderer.update(<MyComponent value />)
      expect(registry.toString({attached: true})).to.be(stripIndent`
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
      const MyComponent = withStyles(styles)()
      let generateId = createGenerateId()
      // Remove renderer to simulate a non-browser env.
      const jss = create({...preset(), Renderer: null})

      TestRenderer.create(
        <JssProvider registry={registry} generateId={generateId} jss={jss}>
          <MyComponent border="green" />
        </JssProvider>
      )

      expect(registry.toString()).to.equal(stripIndent`
        .button-0 {
          color: red;
        }
        .button-d0-1 {
          border: green;
        }
      `)

      registry = new SheetsRegistry()
      generateId = createGenerateId()

      TestRenderer.create(
        <JssProvider registry={registry} generateId={generateId} jss={jss}>
          <MyComponent border="blue" />
        </JssProvider>
      )

      expect(registry.toString()).to.equal(stripIndent`
        .button-0 {
          color: red;
        }
        .button-d0-1 {
          border: blue;
        }
      `)
    })

    it('should be idempotent', () => {
      const MyComponent = withStyles({
        button: {
          color: (props) => props.color
        }
      })()

      const customSheets1 = new SheetsRegistry()
      const customSheets2 = new SheetsRegistry()
      const generateId1 = createGenerateId()
      const generateId2 = createGenerateId()
      // Remove renderer to simulate a non-browser env.
      const jss = create({...preset(), Renderer: null})

      TestRenderer.create(
        <JssProvider registry={customSheets1} generateId={generateId1} jss={jss}>
          <MyComponent color="#000" />
        </JssProvider>
      )

      TestRenderer.create(
        <JssProvider registry={customSheets2} generateId={generateId2} jss={jss}>
          <MyComponent color="#000" />
        </JssProvider>
      )

      const result1 = customSheets1.toString()
      const result2 = customSheets2.toString()

      expect(result1).to.equal(result2)
      expect(result1.length > 0).to.be(true)
    })
  })
})
