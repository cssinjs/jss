/* eslint-disable global-require, react/prop-types, react/no-find-dom-node, react/no-multi-comp, react/prefer-stateless-function */

import expect from 'expect.js'
import React from 'react'
import TestRenderer from 'react-test-renderer'
import {stripIndent} from 'common-tags'

import injectSheet, {JssProvider, SheetsRegistry} from '../src'

const createGenerateId = () => {
  let counter = 0
  return rule => `${rule.key}-${counter++}`
}

describe('React-JSS: dynamic styles', () => {
  const color = 'rgb(255, 255, 255)'
  const NoRenderer = () => null
  NoRenderer.displayName = 'NoRenderer'
  let registry

  beforeEach(() => {
    registry = new SheetsRegistry()
  })

  describe('function values', () => {
    let MyComponent

    beforeEach(() => {
      MyComponent = injectSheet({
        button: {
          color,
          height: ({height = 1}) => `${height}px`
        }
      })(NoRenderer)
    })

    it('should attach and detach a sheet', () => {
      const renderer = TestRenderer.create(
        <JssProvider registry={registry}>
          <MyComponent />
        </JssProvider>
      )

      expect(registry.registry.length).to.equal(1)
      expect(registry.registry[0].attached).to.equal(true)

      renderer.unmount()

      expect(registry.registry[0].attached).to.equal(false)
    })

    it('should have correct meta attribute', () => {
      TestRenderer.create(
        <JssProvider registry={registry}>
          <MyComponent />
        </JssProvider>
      )

      expect(registry.registry[0].options.meta).to.equal('NoRenderer, Unthemed')
    })

    it('should reuse sheet between component instances', () => {
      TestRenderer.create(
        <JssProvider registry={registry}>
          <MyComponent height={2} />
          <MyComponent height={3} />
        </JssProvider>
      )

      expect(registry.registry.length).to.equal(1)
    })

    it('should have dynamic and static styles', () => {
      const renderer = TestRenderer.create(
        <JssProvider generateId={createGenerateId()}>
          <MyComponent />
        </JssProvider>
      )
      const props = renderer.root.findByType(NoRenderer).props

      expect(props.classes.button).to.equal('button-0 button-0-1')
    })

    it('should generate different dynamic values', () => {
      TestRenderer.create(
        <JssProvider registry={registry} generateId={createGenerateId()}>
          <MyComponent height={10} />
          <MyComponent height={20} />
        </JssProvider>
      )

      expect(registry.toString()).to.equal(stripIndent`
        .button-0 {
          color: ${color};
        }
        .button-0-1 {
          height: 10px;
        }
        .button-1-2 {
          height: 20px;
        }
      `)
    })

    it('should update dynamic values', () => {
      const generateId = createGenerateId()
      const Container = ({height}) => (
        <JssProvider registry={registry} generateId={generateId}>
          <MyComponent height={height} />
          <MyComponent height={height * 2} />
        </JssProvider>
      )

      const renderer = TestRenderer.create(<Container height={10} />)

      expect(registry.toString()).to.equal(stripIndent`
        .button-0 {
          color: ${color};
        }
        .button-0-1 {
          height: 10px;
        }
        .button-1-2 {
          height: 20px;
        }
      `)

      renderer.update(<Container height={20} />)

      expect(registry.toString()).to.equal(stripIndent`
        .button-0 {
          color: ${color};
        }
        .button-0-1 {
          height: 20px;
        }
        .button-1-2 {
          height: 40px;
        }
      `)
    })

    it('should unset values when null is returned from fn value', () => {
      const generateId = createGenerateId()
      MyComponent = injectSheet({
        button: {
          width: 10,
          height: ({height}) => height
        }
      })(NoRenderer)
      const Container = ({height}) => (
        <JssProvider registry={registry} generateId={generateId}>
          <MyComponent height={height} />
        </JssProvider>
      )

      const renderer = TestRenderer.create(<Container height={10} />)

      expect(registry.toString()).to.equal(stripIndent`
        .button-0 {
          width: 10px;
        }
        .button-0-1 {
          height: 10px;
        }
      `)

      renderer.update(<Container height={null} />)

      expect(registry.toString()).to.equal(stripIndent`
        .button-0 {
          width: 10px;
        }
        .button-0-1 {}
      `)
    })

    it('should unset values when null is returned from fn rule', () => {
      const generateId = createGenerateId()
      MyComponent = injectSheet({
        button0: {
          width: 10
        },
        button1: ({height}) => ({
          height
        })
      })(NoRenderer)
      const Container = ({height}) => (
        <JssProvider registry={registry} generateId={generateId}>
          <MyComponent height={height} />
        </JssProvider>
      )

      const renderer = TestRenderer.create(<Container height={10} />)

      expect(registry.toString()).to.equal(stripIndent`
        .button0-0 {
          width: 10px;
        }
        .button1-1 {}
        .button1-0-2 {
          height: 10px;
        }
      `)

      renderer.update(<Container height={null} />)

      expect(registry.toString()).to.equal(stripIndent`
        .button0-0 {
          width: 10px;
        }
        .button1-1 {}
        .button1-0-2 {}
      `)
    })

    it('should pass the props of the component', () => {
      let passedProps

      const styles = {
        a: {
          color(props) {
            passedProps = props
            return color
          }
        }
      }
      const InnerComponent = () => null
      InnerComponent.defaultProps = {
        color: 'rgb(255, 0, 0)'
      }
      const StyledComponent = injectSheet(styles)(InnerComponent)

      TestRenderer.create(<StyledComponent height={20} />)

      expect(passedProps.color).to.equal('rgb(255, 0, 0)')
      expect(passedProps.height).to.equal(20)
    })
  })

  describe('function rules', () => {
    let MyComponent

    beforeEach(() => {
      MyComponent = injectSheet({
        button: ({height = 1}) => ({
          color,
          height: `${height}px`
        })
      })(NoRenderer)
    })

    it('should attach and detach a sheet', () => {
      const renderer = TestRenderer.create(
        <JssProvider registry={registry}>
          <MyComponent />
        </JssProvider>
      )

      expect(registry.registry.length).to.equal(1)
      expect(registry.registry[0].attached).to.equal(true)

      renderer.unmount()

      expect(registry.registry[0].attached).to.equal(false)
    })

    it('should have correct meta attribute', () => {
      TestRenderer.create(
        <JssProvider registry={registry}>
          <MyComponent />
        </JssProvider>
      )

      expect(registry.registry[0].options.meta).to.equal('NoRenderer, Unthemed')
    })

    it('should reuse static sheet, but generate separate dynamic once', () => {
      TestRenderer.create(
        <JssProvider registry={registry}>
          <MyComponent height={2} />
          <MyComponent height={3} />
        </JssProvider>
      )

      expect(registry.registry.length).to.equal(1)
    })

    it('should have dynamic and static styles', () => {
      const renderer = TestRenderer.create(
        <JssProvider generateId={createGenerateId()}>
          <MyComponent />
        </JssProvider>
      )
      const props = renderer.root.findByType(NoRenderer).props

      expect(props.classes.button).to.equal('button-0 button-0-1')
    })

    it('should generate different dynamic values', () => {
      TestRenderer.create(
        <JssProvider registry={registry} generateId={createGenerateId()}>
          <MyComponent height={10} />
          <MyComponent height={20} />
        </JssProvider>
      )

      expect(registry.toString()).to.equal(stripIndent`
        .button-0 {}
        .button-0-1 {
          color: rgb(255, 255, 255);
          height: 10px;
        }
        .button-1-2 {
          color: rgb(255, 255, 255);
          height: 20px;
        }
      `)
    })

    it('should update dynamic values', () => {
      const generateId = createGenerateId()
      function Container({height}) {
        return (
          <JssProvider registry={registry} generateId={generateId}>
            <MyComponent height={height} />
            <MyComponent height={height * 2} />
          </JssProvider>
        )
      }

      const renderer = TestRenderer.create(<Container height={10} />)

      expect(registry.toString()).to.equal(stripIndent`
        .button-0 {}
        .button-0-1 {
          color: ${color};
          height: 10px;
        }
        .button-1-2 {
          color: ${color};
          height: 20px;
        }
      `)
      renderer.update(<Container height={20} />)

      expect(registry.toString()).to.equal(stripIndent`
        .button-0 {}
        .button-0-1 {
          color: ${color};
          height: 20px;
        }
        .button-1-2 {
          color: ${color};
          height: 40px;
        }
      `)
    })

    it('should use the default props', () => {
      let passedProps

      const styles = {
        button(props) {
          passedProps = props
          return {color}
        }
      }
      const InnerComponent = () => null
      InnerComponent.defaultProps = {
        color: 'rgb(255, 0, 0)'
      }
      const StyledComponent = injectSheet(styles)(InnerComponent)

      TestRenderer.create(<StyledComponent height={20} />)

      expect(passedProps.color).to.equal('rgb(255, 0, 0)')
      expect(passedProps.height).to.equal(20)
    })
  })
})
