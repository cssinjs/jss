import {describe, it, expect} from 'vitest'
/* eslint-disable global-require, react/prop-types */

import * as React from 'react'
import TestRenderer from 'react-test-renderer'

import injectSheet, {createTheming, ThemeProvider, JssProvider, SheetsRegistry} from '../src'

describe('React-JSS: theming withStyles()', () => {
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

  const ThemedStaticComponent = injectSheet(themedStaticStyles)()
  const ThemedDynamicComponent = injectSheet(themedDynamicStyles)()

  describe('injecting the theme', () => {
    const Comp = () => null

    it('should not inject theme with static classes', () => {
      const StyledComponent = injectSheet({})(Comp)
      const renderer = TestRenderer.create(
        <ThemeProvider theme={themeA}>
          <StyledComponent />
        </ThemeProvider>
      )
      const injectedTheme = renderer.root.findByType(Comp).props.theme

      expect(injectedTheme).toBe(undefined)
    })

    it('should not inject theme with themed classes', () => {
      const StyledComponent = injectSheet(() => ({}))(Comp)
      const renderer = TestRenderer.create(
        <ThemeProvider theme={themeA}>
          <StyledComponent />
        </ThemeProvider>
      )
      const injectedTheme = renderer.root.findByType(Comp).props.theme

      expect(injectedTheme).toBe(undefined)
    })

    it('should inject theme with static classes and injectTheme option', () => {
      const StyledComponent = injectSheet({}, {injectTheme: true})(Comp)
      const renderer = TestRenderer.create(
        <ThemeProvider theme={themeA}>
          <StyledComponent />
        </ThemeProvider>
      )
      const injectedTheme = renderer.root.findByType(Comp).props.theme

      expect(injectedTheme).toBe(themeA)
    })

    it('should inject theme with themed classes and injectTheme option', () => {
      const StyledComponent = injectSheet(() => ({}), {injectTheme: true})(Comp)
      const renderer = TestRenderer.create(
        <ThemeProvider theme={themeA}>
          <StyledComponent />
        </ThemeProvider>
      )
      const injectedTheme = renderer.root.findByType(Comp).props.theme

      expect(injectedTheme).toBe(themeA)
    })

    it('should use the passed theme instead of the actual theme', () => {
      const StyledComponent = injectSheet(() => ({}), {injectTheme: true})(Comp)
      const renderer = TestRenderer.create(
        <ThemeProvider theme={themeA}>
          <StyledComponent theme={themeB} />
        </ThemeProvider>
      )
      const injectedTheme = renderer.root.findByType(Comp).props.theme

      expect(injectedTheme).toBe(themeB)
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

    expect(sheet.options.meta.includes('Themed')).toBe(true)
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
    expect(registry.registry.length).toBe(1)
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

    expect(registry.registry.length).toBe(1)
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

    expect(registry.registry.length).toBe(1)

    renderer.update(
      <ThemeProvider theme={themeB}>
        <JssProvider registry={registry}>
          <ThemedStaticComponent />
        </JssProvider>
      </ThemeProvider>
    )

    expect(registry.registry[0].attached).toBe(false)
    expect(registry.registry.length).toBe(2)
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

    expect(registry.registry.length).toBe(1)

    renderer.update(
      <ThemeProvider theme={themeB}>
        <JssProvider registry={registry}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </JssProvider>
      </ThemeProvider>
    )

    expect(registry.registry[0].attached).toBe(false)
    expect(registry.registry.length).toBe(2)
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

    expect(registry.registry.length).toBe(1)
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

    expect(registry.registry.length).toBe(1)
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

    expect(registry.registry.length).toBe(1)

    renderer.update(
      <ThemeProvider theme={themeB}>
        <JssProvider registry={registry}>
          <ThemedDynamicComponent backgroundColor="#fff" />
          <ThemedDynamicComponent backgroundColor="#fff" />
        </JssProvider>
      </ThemeProvider>
    )

    expect(registry.registry[0].attached).toBe(false)
    expect(registry.registry.length).toBe(2)
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

    expect(registry.registry.length).toBe(1)

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

    expect(registry.registry.length).toBe(2)
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

    expect(registry.registry.length).toBe(1)

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

    expect(registry.registry.length).toBe(2)
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

    expect(registry.registry.length).toBe(2)

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

    expect(registry.registry[1].attached).toBe(false)
    expect(registry.registry.length).toBe(2)
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

    expect(registry.registry.length).toBe(2)

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

    expect(registry.registry[1].attached).toBe(false)
    expect(registry.registry.length).toBe(2)
  })

  describe('when theming object returned from createTheming is provided to injectSheet options', () => {
    it('allows nested ThemeProviders with custom namespace', () => {
      const themingA = createTheming(React.createContext())
      const themingB = createTheming(React.createContext())
      const {ThemeProvider: ThemeProviderA} = themingA
      const {ThemeProvider: ThemeProviderB} = themingB

      let colorReceivedInStyleA
      let colorReceivedInStyleB
      let themeReceivedInComponentA
      let themeReceivedInComponentB

      const styleA = (theme) => {
        colorReceivedInStyleA = theme.color
      }
      const styleB = (theme) => {
        colorReceivedInStyleB = theme.color
      }

      const InnerComponentA = ({theme}) => {
        themeReceivedInComponentA = theme
        return null
      }

      const InnerComponentB = ({theme}) => {
        themeReceivedInComponentB = theme
        return null
      }

      const ComponentA = injectSheet(styleA, {theming: themingA, injectTheme: true})(
        InnerComponentA
      )
      const ComponentB = injectSheet(styleB, {theming: themingB, injectTheme: true})(
        InnerComponentB
      )

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

      expect(themeReceivedInComponentA).toEqual(themeA)
      expect(themeReceivedInComponentB).toEqual(themeB)
      expect(colorReceivedInStyleA).toEqual(themeA.color)
      expect(colorReceivedInStyleB).toEqual(themeB.color)
    })
  })
})
