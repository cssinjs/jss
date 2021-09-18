/* eslint-disable global-require, react/prop-types, react/no-find-dom-node, react/no-multi-comp, react/prefer-stateless-function */
/**
 * This tests are testing a common behavior for dynamic styles between HOC and hooks interfaces.
 */
import expect from 'expect.js'
import * as React from 'react'
import TestRenderer from 'react-test-renderer'
import {stripIndent} from 'common-tags'

import {JssProvider, SheetsRegistry, ThemeProvider} from '../src'

const createGenerateId = () => {
  let counter = 0
  return (rule) => `${rule.key}-${counter++}`
}

export default ({createStyledComponent}) => {
  let registry

  beforeEach(() => {
    registry = new SheetsRegistry()
  })

  describe('function values', () => {
    let MyComponent
    let classes

    beforeEach(() => {
      MyComponent = createStyledComponent(
        {
          button: {
            color: 'rgb(255, 255, 255)',
            height: ({height = 1}) => `${height}px`,
            '&::before': {
              content: '""',
              height: ({height = 1}) => `${height}px`
            }
          }
        },
        {name: 'NoRenderer'}
      )
      MyComponent.defaultProps = {
        getClasses: (cls) => {
          classes = cls
        }
      }
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
      TestRenderer.act(() => {
        TestRenderer.create(
          <JssProvider generateId={createGenerateId()}>
            <MyComponent />
          </JssProvider>
        )
      })

      expect(classes.button).to.equal('button-0 button-d0-1')
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
          color: rgb(255, 255, 255);
        }
        .button-0::before {
          content: "";
        }
        .button-d0-1 {
          height: 10px;
        }
        .button-d0-1::before {
          height: 10px;
        }
        .button-d1-2 {
          height: 20px;
        }
        .button-d1-2::before {
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
          color: rgb(255, 255, 255);
        }
        .button-0::before {
          content: "";
        }
        .button-d0-1 {
          height: 10px;
        }
        .button-d0-1::before {
          height: 10px;
        }
        .button-d1-2 {
          height: 20px;
        }
        .button-d1-2::before {
          height: 20px;
        }
      `)

      renderer.update(<Container height={20} />)

      expect(registry.toString()).to.equal(stripIndent`
        .button-0 {
          color: rgb(255, 255, 255);
        }
        .button-0::before {
          content: "";
        }
        .button-d0-1 {
          height: 20px;
        }
        .button-d0-1::before {
          height: 20px;
        }
        .button-d1-2 {
          height: 40px;
        }
        .button-d1-2::before {
          height: 40px;
        }
      `)
    })

    it('should unset values when null is returned from fn value', () => {
      const generateId = createGenerateId()

      MyComponent = createStyledComponent({
        button: {
          width: 10,
          height: ({height}) => height
        }
      })

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
        .button-d0-1 {
          height: 10px;
        }
      `)

      renderer.update(<Container height={null} />)

      expect(registry.toString()).to.equal(stripIndent`
        .button-0 {
          width: 10px;
        }
        .button-d0-1 {}
      `)
    })

    it('should unset values when null is returned from fn rule', () => {
      const generateId = createGenerateId()
      MyComponent = createStyledComponent({
        button0: {
          width: 10
        },
        button1: ({height}) => ({
          height
        })
      })

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
        .button1-d0-2 {
          height: 10px;
        }
      `)

      renderer.update(<Container height={null} />)

      expect(registry.toString()).to.equal(stripIndent`
        .button0-0 {
          width: 10px;
        }
        .button1-1 {}
        .button1-d0-2 {}
      `)
    })

    it('should pass the props of the component', () => {
      let passedProps

      const styles = {
        a: {
          color(props) {
            passedProps = props
            return 'rgb(255, 255, 255)'
          }
        }
      }

      MyComponent = createStyledComponent(styles)
      MyComponent.defaultProps = {
        color: 'rgb(255, 0, 0)'
      }

      TestRenderer.create(<MyComponent height={20} />)

      expect(passedProps.color).to.equal('rgb(255, 0, 0)')
      expect(passedProps.height).to.equal(20)
    })
    it('should update rules with a nested media query in a list', () => {
      const ListItem = createStyledComponent({
        container: {
          display: 'block',
          '@media (min-width: 0px)': {
            color: ({color}) => color
          }
        }
      })

      MyComponent = ({colors}) => (
        <>
          {colors.map((color) => (
            <ListItem key={color} color={color} />
          ))}
        </>
      )
      const generateId = createGenerateId()

      const Container = ({colors}) => (
        <JssProvider generateId={generateId} registry={registry}>
          <MyComponent colors={colors} />
        </JssProvider>
      )

      let renderer

      TestRenderer.act(() => {
        renderer = TestRenderer.create(<Container colors={['red', 'green']} />)
      })

      expect(registry.toString()).to.equal(stripIndent`
        .container-0 {
          display: block;
        }
        @media (min-width: 0px) {
          .container-0 {  }
        }
          .container-d0-1 {  }
        @media (min-width: 0px) {
          .container-d0-1 {
            color: red;
          }
        }
          .container-d2-2 {  }
        @media (min-width: 0px) {
          .container-d2-2 {
            color: green;
          }
        }
      `)

      TestRenderer.act(() => {
        renderer.update(<Container colors={['blue']} />)
      })

      expect(registry.toString()).to.equal(stripIndent`
        .container-0 {
          display: block;
        }
        @media (min-width: 0px) {
          .container-0 {  }
        }
          .container-d4-3 {  }
        @media (min-width: 0px) {
          .container-d4-3 {
            color: blue;
          }
        }
      `)
    })

    it('should update rules inside a media query in a list', () => {
      const ListItem = createStyledComponent({
        '@media (min-width: 0px)': {
          container: {
            display: 'block',
            color: ({color}) => color
          }
        }
      })

      MyComponent = ({colors}) => (
        <>
          {colors.map((color) => (
            <ListItem key={color} color={color} />
          ))}
        </>
      )
      const generateId = createGenerateId()

      const Container = ({colors}) => (
        <JssProvider generateId={generateId} registry={registry}>
          <MyComponent colors={colors} />
        </JssProvider>
      )

      let renderer

      TestRenderer.act(() => {
        renderer = TestRenderer.create(<Container colors={['red', 'green']} />)
      })

      expect(registry.toString()).to.equal(stripIndent`
        @media (min-width: 0px) {
          .container-0 {
            display: block;
          }
        }
        @media (min-width: 0px) {
          .container-0 {
            color: red;
          }
        }
        @media (min-width: 0px) {
          .container-0 {
            color: green;
          }
        }
      `)

      TestRenderer.act(() => {
        renderer.update(<Container colors={['blue']} />)
      })

      expect(registry.toString()).to.equal(stripIndent`
        @media (min-width: 0px) {
          .container-0 {
            display: block;
          }
        }
        @media (min-width: 0px) {
          .container-0 {
            color: blue;
          }
        }
      `)
    })
  })

  describe('function rules', () => {
    let MyComponent
    let classes

    beforeEach(() => {
      MyComponent = createStyledComponent(
        {
          button: ({height = 1}) => ({
            color: 'rgb(255, 255, 255)',
            height: `${height}px`
          })
        },
        {name: 'NoRenderer'}
      )
      MyComponent.defaultProps = {
        getClasses: (cls) => {
          classes = cls
        }
      }
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
      TestRenderer.create(
        <JssProvider generateId={createGenerateId()}>
          <MyComponent />
        </JssProvider>
      )
      expect(classes.button).to.equal('button-0 button-d0-1')
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
        .button-d0-1 {
          color: rgb(255, 255, 255);
          height: 10px;
        }
        .button-d1-2 {
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
        .button-d0-1 {
          color: rgb(255, 255, 255);
          height: 10px;
        }
        .button-d1-2 {
          color: rgb(255, 255, 255);
          height: 20px;
        }
      `)
      renderer.update(<Container height={20} />)

      expect(registry.toString()).to.equal(stripIndent`
        .button-0 {}
        .button-d0-1 {
          color: rgb(255, 255, 255);
          height: 20px;
        }
        .button-d1-2 {
          color: rgb(255, 255, 255);
          height: 40px;
        }
      `)
    })

    it('should use the default props', () => {
      let passedProps

      const styles = {
        button(props) {
          passedProps = props
          return {color: 'rgb(255, 255, 255)'}
        }
      }

      MyComponent = createStyledComponent(styles)
      MyComponent.defaultProps = {
        color: 'rgb(255, 0, 0)'
      }
      TestRenderer.create(<MyComponent height={20} />)

      expect(passedProps.color).to.equal('rgb(255, 0, 0)')
      expect(passedProps.height).to.equal(20)
    })

    it('should render multiple elements with applied media query and theme function', () => {
      const theme = {
        background: 'yellow',
        background2: 'red'
      }

      const styles = (themeObj) => ({
        wrapper: () => ({
          padding: 40,
          background: themeObj.background,
          textAlign: 'left',
          '@media (min-width: 1024px)': {
            backgroundColor: themeObj.background2
          }
        })
      })

      MyComponent = createStyledComponent(styles)

      const a = [1, 2]
      TestRenderer.create(
        <JssProvider registry={registry} generateId={createGenerateId()}>
          <ThemeProvider theme={theme}>
            {a.map((item) => (
              <MyComponent key={item} />
            ))}
          </ThemeProvider>
        </JssProvider>
      )
      expect(registry.toString()).to.be(stripIndent`
        .wrapper-0 {}
        .wrapper-d0-1 {
          padding: 40px;
          background: yellow;
          text-align: left;
        }
        @media (min-width: 1024px) {
          .wrapper-d0-1 {
            background-color: red;
          }
        }
          .wrapper-d1-2 {
            padding: 40px;
            background: yellow;
            text-align: left;
          }
        @media (min-width: 1024px) {
          .wrapper-d1-2 {
            background-color: red;
          }
        }
      `)
    })
  })
}
