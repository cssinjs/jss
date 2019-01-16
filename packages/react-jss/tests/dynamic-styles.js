/* eslint-disable global-require, react/prop-types, react/no-find-dom-node, react/no-multi-comp, react/prefer-stateless-function */

import expect from 'expect.js'
import React, {PureComponent} from 'react'
import TestRenderer from 'react-test-renderer'
import {stripIndent} from 'common-tags'

import injectSheet, {JssProvider, SheetsRegistry} from '../src'

const removeWhitespaces = str => str.replace(/\s/g, '')
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

      expect(registry.registry.length).to.equal(2)
      expect(registry.registry[0].attached).to.equal(true)
      expect(registry.registry[1].attached).to.equal(true)

      renderer.unmount()

      expect(registry.registry[0].attached).to.equal(false)
      expect(registry.registry[1].attached).to.equal(false)
    })

    it('should have correct meta attribute', () => {
      TestRenderer.create(
        <JssProvider registry={registry}>
          <MyComponent />
        </JssProvider>
      )

      expect(registry.registry[0].options.meta).to.equal('NoRenderer, Unthemed, Static')
      expect(registry.registry[1].options.meta).to.equal('NoRenderer, Unthemed, Dynamic')
    })

    it('should reuse static sheet, but generate separate dynamic once', () => {
      TestRenderer.create(
        <JssProvider registry={registry}>
          <MyComponent height={2} />
          <MyComponent height={3} />
        </JssProvider>
      )

      expect(registry.registry.length).to.equal(3)
    })

    it('should have dynamic and static styles', () => {
      const renderer = TestRenderer.create(
        <JssProvider generateId={createGenerateId()}>
          <MyComponent />
        </JssProvider>
      )
      const props = renderer.root.findByType(NoRenderer).props

      expect(props.classes.button).to.equal('button-0 button-1')
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
      .button-1 {
        height: 10px;
      }
      .button-2 {
        height: 20px;
      }`)
    })

    it('should update dynamic values', () => {
      /* eslint-disable-next-line react/no-multi-comp, react/prefer-stateless-function */
      const generateId = createGenerateId()
      class Container extends PureComponent {
        render() {
          const {height} = this.props
          return (
            <JssProvider registry={registry} generateId={generateId}>
              <MyComponent height={height} />
              <MyComponent height={height * 2} />
            </JssProvider>
          )
        }
      }

      const renderer = TestRenderer.create(<Container height={10} />)

      expect(registry.toString()).to.equal(stripIndent`
      .button-0 {
        color: ${color};
      }
      .button-1 {
        height: 10px;
      }
      .button-2 {
        height: 20px;
      }`)

      renderer.update(<Container height={20} />)

      expect(registry.toString()).to.equal(stripIndent`
      .button-0 {
        color: ${color};
      }
      .button-1 {
        height: 20px;
      }
      .button-2 {
        height: 40px;
      }`)
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

      expect(registry.registry.length).to.equal(2)
      expect(registry.registry[0].attached).to.equal(true)
      expect(registry.registry[1].attached).to.equal(true)

      renderer.unmount()

      expect(registry.registry[0].attached).to.equal(false)
      expect(registry.registry[1].attached).to.equal(false)
    })

    it('should have correct meta attribute', () => {
      TestRenderer.create(
        <JssProvider registry={registry}>
          <MyComponent />
        </JssProvider>
      )

      expect(registry.registry[0].options.meta).to.equal('NoRenderer, Unthemed, Static')
      expect(registry.registry[1].options.meta).to.equal('NoRenderer, Unthemed, Dynamic')
    })

    it('should reuse static sheet, but generate separate dynamic once', () => {
      TestRenderer.create(
        <JssProvider registry={registry}>
          <MyComponent height={2} />
          <MyComponent height={3} />
        </JssProvider>
      )

      expect(registry.registry.length).to.equal(3)
    })

    it('should have dynamic and static styles', () => {
      const renderer = TestRenderer.create(
        <JssProvider generateId={createGenerateId()}>
          <MyComponent />
        </JssProvider>
      )
      const props = renderer.root.findByType(NoRenderer).props

      expect(props.classes.button).to.equal('button-0 button-1')
    })

    it('should generate different dynamic values', () => {
      TestRenderer.create(
        <JssProvider registry={registry} generateId={createGenerateId()}>
          <MyComponent height={10} />
          <MyComponent height={20} />
        </JssProvider>
      )

      expect(removeWhitespaces(registry.toString())).to.equal(
        removeWhitespaces(`
      .button-1 {
        color: ${color};
        height: 10px;
      }
      .button-2 {
        color: ${color};
        height: 20px;
      }
      `)
      )
    })

    it('should update dynamic values', () => {
      const generateId = createGenerateId()
      class Container extends PureComponent {
        render() {
          const {height} = this.props
          return (
            <JssProvider registry={registry} generateId={generateId}>
              <MyComponent height={height} />
              <MyComponent height={height * 2} />
            </JssProvider>
          )
        }
      }

      const renderer = TestRenderer.create(<Container height={10} />)

      expect(removeWhitespaces(registry.toString())).to.equal(
        removeWhitespaces(`
      .button-1 {
        color: ${color};
        height: 10px;
      }
      .button-2 {
        color: ${color};
        height: 20px;
      }`)
      )

      renderer.update(<Container height={20} />)

      expect(removeWhitespaces(registry.toString())).to.equal(
        removeWhitespaces(`
      .button-1 {
        color: ${color};
        height: 20px;
      }
      .button-2 {
        color: ${color};
        height: 40px;
      }`)
      )
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
