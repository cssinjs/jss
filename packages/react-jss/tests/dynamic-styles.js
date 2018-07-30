/* eslint-disable global-require, react/prop-types, react/no-find-dom-node */

import expect from 'expect.js'
import React, {PureComponent} from 'react'
import {findDOMNode, render, unmountComponentAtNode} from 'react-dom'

import injectSheet from '../src'

describe('dynamic styles', () => {
  let node

  beforeEach(() => {
    node = document.body.appendChild(document.createElement('div'))
  })

  afterEach(() => {
    unmountComponentAtNode(node)
    node.parentNode.removeChild(node)
  })

  describe('function values', () => {
    const color = 'rgb(255, 255, 255)'
    let MyComponent

    beforeEach(() => {
      const InnerComponent = ({classes}) => <div className={`${classes.button} ${classes.left}`} />

      MyComponent = injectSheet({
        left: {
          width: '1px'
        },
        button: {
          color,
          height: ({height = 1}) => `${height}px`
        }
      })(InnerComponent)
    })

    it('should attach and detach a sheet', () => {
      render(<MyComponent />, node)
      expect(document.querySelectorAll('style').length).to.be(2)
      unmountComponentAtNode(node)
      expect(document.querySelectorAll('style').length).to.be(0)
    })

    it('should have correct meta attribute', () => {
      render(<MyComponent />, node)
      const styles = document.querySelectorAll('style')
      const meta0 = styles[0].getAttribute('data-meta')
      const meta1 = styles[1].getAttribute('data-meta')
      expect(meta0).to.be('InnerComponent, Unthemed, Static')
      expect(meta1).to.be('InnerComponent, Unthemed, Dynamic')
    })

    it('should reuse static sheet, but generate separate dynamic once', () => {
      render(
        <div>
          <MyComponent height={2} />
          <MyComponent height={3} />
        </div>,
        node
      )
      expect(document.querySelectorAll('style').length).to.be(3)
      unmountComponentAtNode(node)
      expect(document.querySelectorAll('style').length).to.be(0)
    })

    it('should use the default value', () => {
      const node0 = render(
        <div>
          <MyComponent />
        </div>,
        node
      )
      const style0 = getComputedStyle(findDOMNode(node0).querySelector('div'))
      expect(style0.color).to.be(color)
      expect(style0.height).to.be('1px')
    })

    it('should have dynamic and static styles', () => {
      const node0 = render(
        <div>
          <MyComponent />
        </div>,
        node
      )
      const style0 = getComputedStyle(findDOMNode(node0).querySelector('div'))
      expect(style0.color).to.be(color)
      expect(style0.width).to.be('1px')
      expect(style0.height).to.be('1px')
    })

    it('should generate different dynamic values', () => {
      const componentNode = render(
        <div>
          <MyComponent height={10} />
          <MyComponent height={20} />
        </div>,
        node
      )
      const [node0, node1] = componentNode.children
      const style0 = getComputedStyle(node0)
      const style1 = getComputedStyle(node1)

      expect(style0.color).to.be(color)
      expect(style0.height).to.be('10px')
      expect(style1.color).to.be(color)
      expect(style1.height).to.be('20px')
    })

    it('should update dynamic values', () => {
      /* eslint-disable-next-line react/no-multi-comp, react/prefer-stateless-function */
      class Container extends PureComponent {
        render() {
          const {height} = this.props
          return (
            <div>
              <MyComponent height={height} />
              <MyComponent height={height * 2} />
            </div>
          )
        }
      }

      const component = render(<Container height={10} />, node)
      const componentNode = findDOMNode(component)
      const [node0, node1] = componentNode.children
      const style0 = getComputedStyle(node0)
      const style1 = getComputedStyle(node1)

      expect(style0.color).to.be(color)
      expect(style0.height).to.be('10px')
      expect(style1.color).to.be(color)
      expect(style1.height).to.be('20px')

      render(<Container height={20} />, node)

      expect(style0.color).to.be(color)
      expect(style0.height).to.be('20px')
      expect(style1.color).to.be(color)
      expect(style1.height).to.be('40px')

      expect(document.querySelectorAll('style').length).to.be(3)
    })

    it('should use the default props', () => {
      const styles = {
        a: {
          color: props => props.color
        }
      }
      const InnerComponent = ({classes}) => <span className={classes.a} />
      InnerComponent.defaultProps = {
        color: 'rgb(255, 0, 0)'
      }
      const StyledComponent = injectSheet(styles)(InnerComponent)

      const node0 = render(
        <div>
          <StyledComponent />
        </div>,
        node
      )
      const style0 = getComputedStyle(findDOMNode(node0).querySelector('span'))
      expect(style0.color).to.be('rgb(255, 0, 0)')
    })
  })

  describe('function rules', () => {
    const color = 'rgb(255, 255, 255)'
    let MyComponent

    beforeEach(() => {
      const InnerComponent = ({classes}) => <div className={`${classes.button} ${classes.left}`} />

      MyComponent = injectSheet({
        left: {
          width: '1px'
        },
        button: ({height = 1}) => ({
          color,
          height: `${height}px`
        })
      })(InnerComponent)
    })

    it('should attach and detach a sheet', () => {
      render(<MyComponent />, node)
      expect(document.querySelectorAll('style').length).to.be(2)
      unmountComponentAtNode(node)
      expect(document.querySelectorAll('style').length).to.be(0)
    })

    it('should have correct meta attribute', () => {
      render(<MyComponent />, node)
      const styles = document.querySelectorAll('style')
      const meta0 = styles[0].getAttribute('data-meta')
      const meta1 = styles[1].getAttribute('data-meta')
      expect(meta0).to.be('InnerComponent, Unthemed, Static')
      expect(meta1).to.be('InnerComponent, Unthemed, Dynamic')
    })

    it('should reuse static sheet, but generate separate dynamic once', () => {
      render(
        <div>
          <MyComponent height={2} />
          <MyComponent height={3} />
        </div>,
        node
      )
      expect(document.querySelectorAll('style').length).to.be(3)
      unmountComponentAtNode(node)
      expect(document.querySelectorAll('style').length).to.be(0)
    })

    it('should use the default value', () => {
      const node0 = render(
        <div>
          <MyComponent />
        </div>,
        node
      )
      const style0 = getComputedStyle(findDOMNode(node0).querySelector('div'))
      expect(style0.color).to.be(color)
      expect(style0.height).to.be('1px')
    })

    it('should have dynamic and static styles', () => {
      const node0 = render(
        <div>
          <MyComponent />
        </div>,
        node
      )
      const style0 = getComputedStyle(findDOMNode(node0).querySelector('div'))
      expect(style0.color).to.be(color)
      expect(style0.width).to.be('1px')
      expect(style0.height).to.be('1px')
    })

    it('should generate different dynamic values', () => {
      const componentNode = render(
        <div>
          <MyComponent height={10} />
          <MyComponent height={20} />
        </div>,
        node
      )
      const [node0, node1] = componentNode.children
      const style0 = getComputedStyle(node0)
      const style1 = getComputedStyle(node1)

      expect(style0.color).to.be(color)
      expect(style0.height).to.be('10px')
      expect(style1.color).to.be(color)
      expect(style1.height).to.be('20px')
    })

    it('should update dynamic values', () => {
      /* eslint-disable-next-line react/no-multi-comp, react/prefer-stateless-function */
      class Container extends PureComponent {
        render() {
          const {height} = this.props
          return (
            <div>
              <MyComponent height={height} />
              <MyComponent height={height * 2} />
            </div>
          )
        }
      }

      const component = render(<Container height={10} />, node)
      const componentNode = findDOMNode(component)
      const [node0, node1] = componentNode.children
      const style0 = getComputedStyle(node0)
      const style1 = getComputedStyle(node1)

      expect(style0.color).to.be(color)
      expect(style0.height).to.be('10px')
      expect(style1.color).to.be(color)
      expect(style1.height).to.be('20px')

      render(<Container height={20} />, node)

      expect(style0.color).to.be(color)
      expect(style0.height).to.be('20px')
      expect(style1.color).to.be(color)
      expect(style1.height).to.be('40px')

      expect(document.querySelectorAll('style').length).to.be(3)
    })

    it('should use the default props', () => {
      const styles = {
        a: {
          color: props => props.color
        }
      }
      const InnerComponent = ({classes}) => <span className={classes.a} />
      InnerComponent.defaultProps = {
        color: 'rgb(255, 0, 0)'
      }
      const StyledComponent = injectSheet(styles)(InnerComponent)

      const node0 = render(
        <div>
          <StyledComponent />
        </div>,
        node
      )
      const style0 = getComputedStyle(findDOMNode(node0).querySelector('span'))
      expect(style0.color).to.be('rgb(255, 0, 0)')
    })
  })
})
