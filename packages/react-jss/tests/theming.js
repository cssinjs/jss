/* eslint-disable global-require, react/prop-types */

import expect from 'expect.js'
import React from 'react'
import {stripIndent} from 'common-tags'
import preset from 'jss-preset-default'
import {render, unmountComponentAtNode} from 'react-dom'
import {renderToString} from 'react-dom/server'
import {create} from 'jss'

import injectSheet, {createTheming, ThemeProvider, JssProvider, SheetsRegistry} from '../src'

const removeWhitespaces = s => s.replace(/\s/g, '')

describe('theming', () => {
  let node

  beforeEach(() => {
    node = document.body.appendChild(document.createElement('div'))
  })

  afterEach(() => {
    unmountComponentAtNode(node)
    node.parentNode.removeChild(node)
  })

  const themedStaticStyles = theme => ({
    rule: {
      color: theme.color
    }
  })
  const themedDynamicStyles = theme => ({
    rule: {
      color: theme.color,
      backgroundColor: props => props.backgroundColor
    }
  })
  const ThemeA = {color: '#aaa'}
  const ThemeB = {color: '#bbb'}

  const ThemedStaticComponent = injectSheet(themedStaticStyles)()
  const ThemedDynamicComponent = injectSheet(themedDynamicStyles)()

  let localJss

  beforeEach(() => {
    localJss = create({
      ...preset(),
      createGenerateClassName: () => {
        let counter = 0
        return rule => `${rule.key}-${counter++}`
      }
    })
  })

  it('should have correct meta attribute for static styles', () => {
    render(
      <ThemeProvider theme={ThemeA}>
        <ThemedDynamicComponent />
      </ThemeProvider>,
      node
    )
    const styles = document.querySelectorAll('style')
    const meta0 = styles[0].getAttribute('data-meta')
    expect(meta0).to.be('NoRenderer, Themed, Static')
    const meta1 = styles[1].getAttribute('data-meta')
    expect(meta1).to.be('NoRenderer, Themed, Dynamic')
  })

  it('one themed instance wo/ dynamic props = 1 style', () => {
    render(
      <div>
        <ThemeProvider theme={ThemeA}>
          <ThemedStaticComponent />
        </ThemeProvider>
      </div>,
      node
    )
    expect(document.querySelectorAll('style').length).to.equal(1)
  })

  it('one themed instance w/ dynamic props = 2 styles', () => {
    render(
      <div>
        <ThemeProvider theme={ThemeA}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </ThemeProvider>
      </div>,
      node
    )
    expect(document.querySelectorAll('style').length).to.equal(2)
  })

  it('one themed instance wo/ = 1 style, theme update = 1 style', () => {
    render(
      <div>
        <ThemeProvider theme={ThemeA}>
          <ThemedStaticComponent />
        </ThemeProvider>
      </div>,
      node
    )

    expect(document.querySelectorAll('style').length).to.equal(1)

    render(
      <div>
        <ThemeProvider theme={ThemeB}>
          <ThemedStaticComponent />
        </ThemeProvider>
      </div>,
      node
    )

    expect(document.querySelectorAll('style').length).to.equal(1)
  })

  it('one themed instance w/ dynamic props = 2 styles, theme update = 2 styles', () => {
    render(
      <div>
        <ThemeProvider theme={ThemeA}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </ThemeProvider>
      </div>,
      node
    )

    expect(document.querySelectorAll('style').length).to.equal(2)

    render(
      <div>
        <ThemeProvider theme={ThemeB}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </ThemeProvider>
      </div>,
      node
    )

    expect(document.querySelectorAll('style').length).to.equal(2)
  })

  it('two themed instances wo/ dynamic props w/ same theme = 1 style', () => {
    render(
      <div>
        <ThemeProvider theme={ThemeA}>
          <div>
            <ThemedStaticComponent />
            <ThemedStaticComponent />
          </div>
        </ThemeProvider>
      </div>,
      node
    )

    expect(document.querySelectorAll('style').length).to.equal(1)
  })

  it('two themed instances w/ dynamic props w/ same theme = 3 styles', () => {
    render(
      <div>
        <ThemeProvider theme={ThemeA}>
          <div>
            <ThemedDynamicComponent backgroundColor="#fff" />
            <ThemedDynamicComponent backgroundColor="#fff" />
          </div>
        </ThemeProvider>
      </div>,
      node
    )

    expect(document.querySelectorAll('style').length).to.equal(3)
  })

  it('two themed instances wo/ dynamic props w/ same theme = 1 style, theme update = 1 style', () => {
    render(
      <div>
        <ThemeProvider theme={ThemeA}>
          <div>
            <ThemedStaticComponent />
            <ThemedStaticComponent />
          </div>
        </ThemeProvider>
      </div>,
      node
    )

    expect(document.querySelectorAll('style').length).to.equal(1)

    render(
      <div>
        <ThemeProvider theme={ThemeB}>
          <div>
            <ThemedStaticComponent />
            <ThemedStaticComponent />
          </div>
        </ThemeProvider>
      </div>,
      node
    )

    expect(document.querySelectorAll('style').length).to.equal(1)
  })

  it('two themed instances w/ dynamic props w/ same theme = 3 styles, theme update = 3 styles', () => {
    render(
      <div>
        <ThemeProvider theme={ThemeA}>
          <div>
            <ThemedDynamicComponent backgroundColor="#fff" />
            <ThemedDynamicComponent backgroundColor="#fff" />
          </div>
        </ThemeProvider>
      </div>,
      node
    )

    expect(document.querySelectorAll('style').length).to.equal(3)

    render(
      <div>
        <ThemeProvider theme={ThemeB}>
          <div>
            <ThemedDynamicComponent backgroundColor="#fff" />
            <ThemedDynamicComponent backgroundColor="#fff" />
          </div>
        </ThemeProvider>
      </div>,
      node
    )

    expect(document.querySelectorAll('style').length).to.equal(3)
  })

  it('two themed instances wo/ dynamic props w/ same theme = 1 styles, different theme update = 2 styles', () => {
    render(
      <div>
        <ThemeProvider theme={ThemeA}>
          <ThemedStaticComponent />
        </ThemeProvider>
        <ThemeProvider theme={ThemeA}>
          <ThemedStaticComponent />
        </ThemeProvider>
      </div>,
      node
    )

    expect(document.querySelectorAll('style').length).to.equal(1)

    render(
      <div>
        <ThemeProvider theme={ThemeA}>
          <ThemedStaticComponent />
        </ThemeProvider>
        <ThemeProvider theme={ThemeB}>
          <ThemedStaticComponent />
        </ThemeProvider>
      </div>,
      node
    )

    expect(document.querySelectorAll('style').length).to.equal(2)
  })

  it('two themed instances w/ dynamic props w/ same theme = 3 styles, different theme update = 4 styles', () => {
    render(
      <div>
        <ThemeProvider theme={ThemeA}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </ThemeProvider>
        <ThemeProvider theme={ThemeA}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </ThemeProvider>
      </div>,
      node
    )

    expect(document.querySelectorAll('style').length).to.equal(3)

    render(
      <div>
        <ThemeProvider theme={ThemeA}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </ThemeProvider>
        <ThemeProvider theme={ThemeB}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </ThemeProvider>
      </div>,
      node
    )

    expect(document.querySelectorAll('style').length).to.equal(4)
  })

  it('two themed instances wo/ dynamic props w/ different themes = 2 styles, same theme update = 1 style', () => {
    render(
      <div>
        <ThemeProvider theme={ThemeA}>
          <ThemedStaticComponent />
        </ThemeProvider>
        <ThemeProvider theme={ThemeB}>
          <ThemedStaticComponent />
        </ThemeProvider>
      </div>,
      node
    )

    expect(document.querySelectorAll('style').length).to.equal(2)

    render(
      <div>
        <ThemeProvider theme={ThemeA}>
          <ThemedStaticComponent />
        </ThemeProvider>
        <ThemeProvider theme={ThemeA}>
          <ThemedStaticComponent />
        </ThemeProvider>
      </div>,
      node
    )

    expect(document.querySelectorAll('style').length).to.equal(1)
  })

  it('two themed instances w/ dynamic props w/ different themes = 4 styles, same theme update = 3 styles', () => {
    render(
      <div>
        <ThemeProvider theme={ThemeA}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </ThemeProvider>
        <ThemeProvider theme={ThemeB}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </ThemeProvider>
      </div>,
      node
    )

    expect(document.querySelectorAll('style').length).to.equal(4)

    render(
      <div>
        <ThemeProvider theme={ThemeA}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </ThemeProvider>
        <ThemeProvider theme={ThemeA}>
          <ThemedDynamicComponent backgroundColor="#fff" />
        </ThemeProvider>
      </div>,
      node
    )

    expect(document.querySelectorAll('style').length).to.equal(3)
  })

  it('with JssProvider should render two different sheets', () => {
    const ComponentA = injectSheet(() => ({a: {color: 'red'}}))()
    const ComponentB = injectSheet(() => ({b: {color: 'green'}}))()
    render(
      <JssProvider jss={localJss}>
        <ThemeProvider theme={{}}>
          <div>
            <ComponentA />
            <ComponentB />
          </div>
        </ThemeProvider>
      </JssProvider>,
      node
    )

    const styleTags = Array.from(document.querySelectorAll('style'))
    const actual = styleTags.map(x => removeWhitespaces(x.innerText)).join('')

    expect(actual).to.be(
      removeWhitespaces(`
      .a-0 {
        color: red;
      }
      .b-1 {
        color: green;
      }
    `)
    )
  })

  it('should render two different sheets with theming', () => {
    const ComponentA = injectSheet(() => ({a: {color: 'red'}}))()
    const ComponentB = injectSheet(() => ({b: {color: 'green'}}))()
    const registry = new SheetsRegistry()

    renderToString(
      <JssProvider registry={registry} jss={localJss}>
        <ThemeProvider theme={{}}>
          <div>
            <ComponentA />
            <ComponentB />
          </div>
        </ThemeProvider>
      </JssProvider>
    )

    expect(registry.toString()).to.be(stripIndent`
      .a-0 {
        color: red;
      }
      .b-1 {
        color: green;
      }
    `)
  })

  describe('when theming object returned from createTheming is provided to injectSheet options', () => {
    it('allows nested ThemeProviders with custom namespace', () => {
      const themingA = createTheming('__THEME_A__')
      const themingB = createTheming('__THEME_B__')
      const {ThemeProvider: ThemeProviderA} = themingA
      const {ThemeProvider: ThemeProviderB} = themingB

      let colorReceivedInStyleA
      let colorReceivedInStyleB
      let themeReceivedInComponentA
      let themeReceivedInComponentB

      const styleA = theme => (colorReceivedInStyleA = {a: {color: theme.color}})
      const styleB = theme => (colorReceivedInStyleB = {a: {color: theme.color}})

      const InnerComponentA = ({theme}) => {
        themeReceivedInComponentA = theme
        return null
      }

      const InnerComponentB = ({theme}) => {
        themeReceivedInComponentB = theme
        return null
      }

      const ComponentA = injectSheet(styleA, {theming: themingA})(InnerComponentA)
      const ComponentB = injectSheet(styleB, {theming: themingB})(InnerComponentB)

      render(
        <div>
          <ThemeProviderA theme={ThemeA}>
            <ThemeProviderB theme={ThemeB}>
              <div>
                <ComponentA />
                <ComponentB />
              </div>
            </ThemeProviderB>
          </ThemeProviderA>
        </div>,
        node
      )

      expect(themeReceivedInComponentA).to.be(ThemeA)
      expect(themeReceivedInComponentB).to.be(ThemeB)
      expect(colorReceivedInStyleA).to.eql({a: {color: ThemeA.color}})
      expect(colorReceivedInStyleB).to.eql({a: {color: ThemeB.color}})
    })
  })
})
