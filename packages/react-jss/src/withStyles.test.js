/* eslint-disable  react/prop-types */

import expect from 'expect.js'
import React from 'react'
import {spy} from 'sinon'
import TestRenderer from 'react-test-renderer'

import {withStyles, JssProvider} from '.'
import createBasicTests from '../test-utils/createBasicTests'

const createGenerateId = () => {
  let counter = 0
  return rule => `${rule.key}-${counter++}`
}

const createStyledComponent = (styles, options = {}) => {
  const Comp = () => null
  Comp.displayName = options.name
  return withStyles(styles, options)(Comp)
}

describe('React-JSS: withStyles', () => {
  createBasicTests({createStyledComponent})

  describe('should merge the classes', () => {
    const styles = {
      button: {color: 'red'}
    }

    it('no default props + no user classes -> sheet classes', () => {
      const Comp = () => null
      const StyledComponent = withStyles(styles)(Comp)
      const renderer = TestRenderer.create(
        <JssProvider generateId={createGenerateId()}>
          <StyledComponent />
        </JssProvider>
      )
      const injectedClasses = renderer.root.findByType(Comp).props.classes

      expect(injectedClasses.button).to.be('button-0')
    })

    it('default props + no user classes -> merge sheet classes with default props classes', () => {
      const Comp = () => null
      Comp.defaultProps = {classes: {button: 'default-button'}}
      const StyledComponent = withStyles(styles)(Comp)
      const renderer = TestRenderer.create(
        <JssProvider generateId={createGenerateId()}>
          <StyledComponent />
        </JssProvider>
      )
      const injectedClasses = renderer.root.findByType(Comp).props.classes

      expect(injectedClasses.button).to.be('button-0 default-button')
    })

    it('default props + user classes -> merge sheet classes with user classes prop', () => {
      const Comp = () => null
      Comp.defaultProps = {
        classes: {
          button: 'default-button',
          test: 'test'
        }
      }
      const StyledComponent = withStyles(styles)(Comp)
      const renderer = TestRenderer.create(
        <JssProvider generateId={createGenerateId()}>
          <StyledComponent classes={{button: 'custom-button'}} />
        </JssProvider>
      )
      const injectedClasses = renderer.root.findByType(Comp).props.classes

      expect(injectedClasses.button).to.be('button-0 custom-button')
      expect(injectedClasses.test).to.be(undefined)
    })

    it('no default props + user classes -> merge sheet classes with user classes prop', () => {
      const Comp = () => null
      const StyledComponent = withStyles(styles)(Comp)
      const renderer = TestRenderer.create(
        <JssProvider generateId={createGenerateId()}>
          <StyledComponent classes={{button: 'custom-button'}} />
        </JssProvider>
      )
      const injectedClasses = renderer.root.findByType(Comp).props.classes

      expect(injectedClasses.button).to.be('button-0 custom-button')
    })
  })

  describe('access inner component', () => {
    it('should be exposed using "InnerComponent" property', () => {
      const Comp = () => null
      const ComponentOuter = withStyles({
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

      const StyledComponent = withStyles()(InnerComponent)
      TestRenderer.create(<StyledComponent ref={innerRef} />)

      expect(innerRef.callCount).to.be(1)
    })
  })
})
