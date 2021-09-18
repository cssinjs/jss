/* eslint-disable react/prop-types */

import expect from 'expect.js'
import * as React from 'react'
import TestRenderer from 'react-test-renderer'

import {
  createUseStyles,
  useTheme,
  createTheming,
  ThemeProvider,
  JssProvider,
  SheetsRegistry
} from '../src'

const createStyledComponent = (styles, options = {}) => {
  const useStyles = createUseStyles(styles, options)
  const Comp = (props) => {
    useStyles(props)

    const theme = props.theme || (options.theming ? options.theming.useTheme() : useTheme())
    if (props.getTheme) props.getTheme(theme)
    return null
  }
  Comp.displayName = options.name
  return Comp
}

describe('React-JSS: theming useStyles()', () => {
  const themedStaticStyles = (theme) => ({
    rule: {
      color: theme.color
    }
  })
  const themedDynamicStyles = (theme) => ({
    rule: {
      color: theme.color,
      backgroundColor: (props) => props.backgroundColor
    }
  })
  const themeA = {color: '#aaa'}
  const themeB = {color: '#bbb'}

  const ThemedStaticComponent = createStyledComponent(themedStaticStyles)
  const ThemedDynamicComponent = createStyledComponent(themedDynamicStyles)

  describe('injecting the theme', () => {
    let themeFromUseTheme
    let themeFromStylesFn

    const defaultProps = {
      getTheme: (theme) => {
        themeFromUseTheme = theme
      }
    }

    beforeEach(() => {
      themeFromUseTheme = {}
      themeFromStylesFn = {}
    })

    it('should subscribe theme with useTheme, but not with useStyles', () => {
      const StyledComponent = createStyledComponent({})
      StyledComponent.defaultProps = defaultProps
      TestRenderer.create(
        <ThemeProvider theme={themeA}>
          <StyledComponent />
        </ThemeProvider>
      )
      expect(themeFromUseTheme).to.be(themeA)
      expect(themeFromStylesFn).to.eql({})
    })

    it('should warn when styles function has no arguments', () => {})

    it('should subscribe theme with useTheme and with useStyles', () => {
      const StyledComponent = createStyledComponent((theme) => {
        themeFromStylesFn = theme
        return {}
      })
      StyledComponent.defaultProps = defaultProps
      TestRenderer.create(
        <ThemeProvider theme={themeA}>
          <StyledComponent />
        </ThemeProvider>
      )
      expect(themeFromUseTheme).to.be(themeA)
      expect(themeFromStylesFn).to.eql(themeA)
    })

    it('should use the theme from props instead of the one from provider', () => {
      const StyledComponent = createStyledComponent({})
      StyledComponent.defaultProps = defaultProps
      TestRenderer.create(
        <ThemeProvider theme={themeA}>
          <StyledComponent theme={themeB} />
        </ThemeProvider>
      )
      expect(themeFromUseTheme).to.equal(themeB)
    })
  })

  it('should have correct meta attribute for themed styles', () => {
    let sheet
    const generateId = (rule, s) => {
      sheet = s
      return rule.key
    }
    TestRenderer.create(
      <JssProvider generateId={generateId}>
        <ThemeProvider theme={themeA}>
          <ThemedStaticComponent />
        </ThemeProvider>
      </JssProvider>
    )

    expect(sheet.options.meta.includes('Themed')).to.be(true)
  })

  it('one themed instance wo/ dynamic props = 1 style', () => {
    const registry = new SheetsRegistry()
    TestRenderer.create(
      <JssProvider registry={registry}>
        <ThemeProvider theme={themeA}>
          <ThemedStaticComponent />
        </ThemeProvider>
      </JssProvider>
    )
    expect(registry.registry.length).to.equal(1)
  })

  it('one themed instance w/ dynamic props = 2 styles', () => {
    const registry = new SheetsRegistry()
    TestRenderer.create(
      <JssProvider registry={registry}>
        <ThemeProvider theme={themeA}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </ThemeProvider>
      </JssProvider>
    )

    expect(registry.registry.length).to.equal(1)
  })

  it('one themed instance wo/ = 1 style, theme update = 1 style', () => {
    const registry = new SheetsRegistry()
    const renderer = TestRenderer.create(
      <ThemeProvider theme={themeA}>
        <JssProvider registry={registry}>
          <ThemedStaticComponent />
        </JssProvider>
      </ThemeProvider>
    )

    expect(registry.registry.length).to.equal(1)

    renderer.update(
      <ThemeProvider theme={themeB}>
        <JssProvider registry={registry}>
          <ThemedStaticComponent />
        </JssProvider>
      </ThemeProvider>
    )

    expect(registry.registry[0].attached).to.be(false)
    expect(registry.registry.length).to.equal(2)
  })

  it('one themed instance w/ dynamic props = 2 styles, theme update = 2 styles', () => {
    const registry = new SheetsRegistry()
    const renderer = TestRenderer.create(
      <ThemeProvider theme={themeA}>
        <JssProvider registry={registry}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </JssProvider>
      </ThemeProvider>
    )

    expect(registry.registry.length).to.equal(1)

    renderer.update(
      <ThemeProvider theme={themeB}>
        <JssProvider registry={registry}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </JssProvider>
      </ThemeProvider>
    )

    expect(registry.registry[0].attached).to.be(false)
    expect(registry.registry.length).to.equal(2)
  })

  it('two themed instances wo/ dynamic props w/ same theme = 1 style', () => {
    const registry = new SheetsRegistry()
    TestRenderer.create(
      <JssProvider registry={registry}>
        <ThemeProvider theme={themeA}>
          <ThemedStaticComponent />
          <ThemedStaticComponent />
        </ThemeProvider>
      </JssProvider>
    )

    expect(registry.registry.length).to.equal(1)
  })

  it('two themed instances w/ dynamic props w/ same theme = 3 styles', () => {
    const registry = new SheetsRegistry()
    TestRenderer.create(
      <JssProvider registry={registry}>
        <ThemeProvider theme={themeA}>
          <ThemedDynamicComponent backgroundColor="#fff" />
          <ThemedDynamicComponent backgroundColor="#fff" />
        </ThemeProvider>
      </JssProvider>
    )

    expect(registry.registry.length).to.equal(1)
  })

  it('two themed instances w/ dynamic props w/ same theme = 3 styles, theme update = 3 styles', () => {
    const registry = new SheetsRegistry()
    const renderer = TestRenderer.create(
      <ThemeProvider theme={themeA}>
        <JssProvider registry={registry}>
          <ThemedDynamicComponent backgroundColor="#fff" />
          <ThemedDynamicComponent backgroundColor="#fff" />
        </JssProvider>
      </ThemeProvider>
    )

    expect(registry.registry.length).to.equal(1)

    renderer.update(
      <ThemeProvider theme={themeB}>
        <JssProvider registry={registry}>
          <ThemedDynamicComponent backgroundColor="#fff" />
          <ThemedDynamicComponent backgroundColor="#fff" />
        </JssProvider>
      </ThemeProvider>
    )

    expect(registry.registry[0].attached).to.equal(false)
    expect(registry.registry.length).to.equal(2)
  })

  it('two themed instances wo/ dynamic props w/ same theme = 1 styles, different theme update = 2 styles', () => {
    const registry = new SheetsRegistry()
    const renderer = TestRenderer.create(
      <JssProvider registry={registry}>
        <ThemeProvider theme={themeA}>
          <ThemedStaticComponent />
        </ThemeProvider>
        <ThemeProvider theme={themeA}>
          <ThemedStaticComponent />
        </ThemeProvider>
      </JssProvider>
    )

    expect(registry.registry.length).to.equal(1)

    renderer.update(
      <JssProvider registry={registry}>
        <ThemeProvider theme={themeA}>
          <ThemedStaticComponent />
        </ThemeProvider>
        <ThemeProvider theme={themeB}>
          <ThemedStaticComponent />
        </ThemeProvider>
      </JssProvider>
    )

    expect(registry.registry.length).to.equal(2)
  })

  it('two themed instances w/ dynamic props w/ same theme = 3 styles, different theme update = 4 styles', () => {
    const registry = new SheetsRegistry()
    const renderer = TestRenderer.create(
      <JssProvider registry={registry}>
        <ThemeProvider theme={themeA}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </ThemeProvider>
        <ThemeProvider theme={themeA}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </ThemeProvider>
      </JssProvider>
    )

    expect(registry.registry.length).to.equal(1)

    renderer.update(
      <JssProvider registry={registry}>
        <ThemeProvider theme={themeA}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </ThemeProvider>
        <ThemeProvider theme={themeB}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </ThemeProvider>
      </JssProvider>
    )

    expect(registry.registry.length).to.equal(2)
  })

  it('two themed instances wo/ dynamic props w/ different themes = 2 styles, same theme update = 1 style', () => {
    const registry = new SheetsRegistry()
    const renderer = TestRenderer.create(
      <JssProvider registry={registry}>
        <ThemeProvider theme={themeA}>
          <ThemedStaticComponent />
        </ThemeProvider>
        <ThemeProvider theme={themeB}>
          <ThemedStaticComponent />
        </ThemeProvider>
      </JssProvider>
    )

    expect(registry.registry.length).to.equal(2)

    renderer.update(
      <JssProvider registry={registry}>
        <ThemeProvider theme={themeA}>
          <ThemedStaticComponent />
        </ThemeProvider>
        <ThemeProvider theme={themeA}>
          <ThemedStaticComponent />
        </ThemeProvider>
      </JssProvider>
    )

    expect(registry.registry[1].attached).to.equal(false)
    expect(registry.registry.length).to.equal(2)
  })

  it('two themed instances w/ dynamic props w/ different themes = 4 styles, same theme update = 3 styles', () => {
    const registry = new SheetsRegistry()
    const renderer = TestRenderer.create(
      <JssProvider registry={registry}>
        <ThemeProvider theme={themeA}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </ThemeProvider>
        <ThemeProvider theme={themeB}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </ThemeProvider>
      </JssProvider>
    )

    expect(registry.registry.length).to.equal(2)

    renderer.update(
      <JssProvider registry={registry}>
        <ThemeProvider theme={themeA}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </ThemeProvider>
        <ThemeProvider theme={themeA}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </ThemeProvider>
      </JssProvider>
    )

    expect(registry.registry[1].attached).to.equal(false)
    expect(registry.registry.length).to.equal(2)
  })

  describe('when theming object returned from createTheming is provided to injectSheet options', () => {
    it('allows nested ThemeProviders with custom namespace', () => {
      const themingA = createTheming(React.createContext())
      const themingB = createTheming(React.createContext())
      const {ThemeProvider: ThemeProviderA} = themingA
      const {ThemeProvider: ThemeProviderB} = themingB

      let colorReceivedInStylesA
      let colorReceivedInStylesB
      let themeReceivedInComponentA
      let themeReceivedInComponentB

      const stylesA = (theme) => {
        colorReceivedInStylesA = theme.color
      }
      const stylesB = (theme) => {
        colorReceivedInStylesB = theme.color
      }

      const ComponentA = createStyledComponent(stylesA, {theming: themingA})
      ComponentA.defaultProps = {
        getTheme: (theme) => {
          themeReceivedInComponentA = theme
        }
      }
      const ComponentB = createStyledComponent(stylesB, {theming: themingB})
      ComponentB.defaultProps = {
        getTheme: (theme) => {
          themeReceivedInComponentB = theme
        }
      }

      TestRenderer.create(
        <ThemeProviderA theme={themeA}>
          <ThemeProviderB theme={themeB}>
            <div>
              <ComponentA />
              <ComponentB />
            </div>
          </ThemeProviderB>
        </ThemeProviderA>
      )

      expect(themeReceivedInComponentA).to.eql(themeA)
      expect(themeReceivedInComponentB).to.eql(themeB)
      expect(colorReceivedInStylesA).to.eql(themeA.color)
      expect(colorReceivedInStylesB).to.eql(themeB.color)
    })
  })
})
