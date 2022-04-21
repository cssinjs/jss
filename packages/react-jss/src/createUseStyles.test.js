/* eslint-disable react/prop-types */

import * as React from 'react'
import {renderToString} from 'react-dom/server'
import TestRenderer from 'react-test-renderer'
import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import createCommonBaseTests from '../test-utils/createCommonBaseTests'
import {createUseStyles, JssProvider, SheetsRegistry} from '.'

const createStyledComponent = (styles, options) => {
  const useStyles = createUseStyles(styles, options)
  const Comp = ({getClasses, ...restProps}) => {
    const classes = useStyles(restProps)
    if (getClasses) {
      getClasses(classes)
    }
    return null
  }
  return Comp
}

describe('React-JSS: createUseStyles', () => {
  createCommonBaseTests({createStyledComponent})

  describe('theme prop', () => {
    it('should pass theme from props priority', () => {
      const registry = new SheetsRegistry()

      const styles = (theme) => ({
        button: {color: theme.exampleColor || 'green'}
      })

      const MyComponent = createStyledComponent(styles)

      renderToString(
        <JssProvider registry={registry} generateId={() => 'button'} isSSR>
          <MyComponent theme={{exampleColor: 'blue'}} />
        </JssProvider>
      )
      expect(registry.toString()).to.be(stripIndent`
      .button {
        color: blue;
      }
    `)
    })
  })

  describe('multiple components that share same hook', () => {
    const useStyles = createUseStyles({
      item: (props) => ({
        color: props.active ? 'red' : 'blue',
        '&:hover': {
          fontSize: 60
        }
      })
    })

    function Item({active = false, onClick, children}) {
      const classes = useStyles({active})
      return (
        <button type="button" className={classes.item} onClick={onClick}>
          {children}
        </button>
      )
    }

    function App() {
      const [activeKey, setActiveKey] = React.useState(1)
      return (
        <main>
          {[1, 2].map((key) => (
            <Item key={key} active={key === activeKey} onClick={() => setActiveKey(key)}>
              {key}
            </Item>
          ))}
        </main>
      )
    }

    let registry
    let root
    beforeEach(() => {
      registry = new SheetsRegistry()

      TestRenderer.act(() => {
        root = TestRenderer.create(
          <JssProvider registry={registry} generateId={(rule) => `${rule.key}-id`}>
            <App />
          </JssProvider>
        )
      })
    })

    it('should return correct registry.toString at first render', () => {
      expect(registry.toString()).to.be(stripIndent`
        .item-id {}
        .item-d0-id {
          color: red;
        }
        .item-d0-id:hover {
          font-size: 60px;
        }
        .item-d1-id {
          color: blue;
        }
        .item-d1-id:hover {
          font-size: 60px;
        }
      `)
    })

    it('should return correct registry.toString after update via click', () => {
      TestRenderer.act(() => {
        root.root.findAllByType('button')[1].props.onClick()
      })

      expect(registry.toString()).to.be(stripIndent`
        .item-id {}
        .item-d0-id {
          color: blue;
        }
        .item-d0-id:hover {
          font-size: 60px;
        }
        .item-d1-id {
          color: red;
        }
        .item-d1-id:hover {
          font-size: 60px;
        }
      `)
    })
  })

  describe('empty object', () => {
    it('should return same empty object when disableStylesGeneration is true', () => {
      const MyComponent = createStyledComponent()

      const classes = []

      const getClasses = (currentClasses) => {
        classes.push(currentClasses)
      }

      let root
      TestRenderer.act(() => {
        root = TestRenderer.create(
          <JssProvider disableStylesGeneration>
            <MyComponent getClasses={getClasses} />
          </JssProvider>
        )
      })

      TestRenderer.act(() => {
        root.update(
          <JssProvider disableStylesGeneration>
            <MyComponent getClasses={getClasses} />
          </JssProvider>
        )
      })

      expect(classes[0]).to.be(classes[1])
    })
  })

  describe('undesirable re-render', () => {
    it("should return previous classes when sheet and dynamicRules haven't change", () => {
      const MyComponent = createStyledComponent()

      const classes = []

      const getClasses = (currentClasses) => {
        classes.push(currentClasses)
      }

      let root
      TestRenderer.act(() => {
        root = TestRenderer.create(<MyComponent getClasses={getClasses} />)
      })

      TestRenderer.act(() => {
        root.update(<MyComponent getClasses={getClasses} />)
      })

      expect(classes[0]).to.be(classes[1])
    })
  })
})
