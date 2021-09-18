/* eslint-disable react/prop-types */

import expect from 'expect.js'
import * as React from 'react'
import TestRenderer from 'react-test-renderer'
import {stripIndent} from 'common-tags'
import {space, width, color, fontSize, fontWeight, lineHeight, compose} from 'styled-system'

import {withStyles, styled, SheetsRegistry, JssProvider, ThemeProvider} from '../src'

const createGenerateId = () => {
  let counter = 0
  return (rule) => `${rule.key}-${counter++}`
}

const theme = {
  fontSizes: [12, 14, 16, 24, 32, 48, 64, 96, 128],
  space: [
    // margin and padding
    0, 4, 8, 16, 32, 64, 128, 256
  ],
  colors: {
    blue: '#07c',
    red: '#e10'
  }
}

describe('React-JSS: styled-system', () => {
  it('should reder basic spacing', () => {
    const registry = new SheetsRegistry()
    const Div = styled('div')(space)
    const renderer = TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <ThemeProvider theme={theme}>
          <Div px={1} />
        </ThemeProvider>
      </JssProvider>
    )
    // TODO we should not need a static rule in such cases.
    expect(registry.toString()).to.be(stripIndent`
      .scd-0 {}
      .scd-d0-1 {
        padding-left: 4px;
        padding-right: 4px;
      }
    `)
    const {className, classes} = renderer.root.findByType('div').props
    expect(className).to.be('scd-0 scd-d0-1')
    expect(classes).to.be(undefined)
  })

  it('should render a number of composed style rules with styled API', () => {
    const registry = new SheetsRegistry()
    const Div = styled('div')(compose(space, color, fontSize, width, fontWeight, lineHeight))
    const renderer = TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <ThemeProvider theme={theme}>
          <Div
            px={[3, 4]}
            py={[1, 2]}
            color="white"
            bg="blue"
            fontSize={[4, 5, 6]}
            fontWeight="bold"
          />
        </ThemeProvider>
      </JssProvider>
    )
    // TODO we should not need a static rule in such cases.
    expect(registry.toString()).to.be(stripIndent`
      .scd-0 {}
      .scd-d0-1 {
        color: white;
        font-size: 32px;
        font-weight: bold;
        padding-top: 4px;
        padding-left: 16px;
        padding-right: 16px;
        padding-bottom: 4px;
        background-color: #07c;
      }
      @media screen and (min-width: 40em) {
        .scd-d0-1 {
          font-size: 48px;
          padding-top: 8px;
          padding-left: 32px;
          padding-right: 32px;
          padding-bottom: 8px;
        }
      }
      @media screen and (min-width: 52em) {
        .scd-d0-1 {
          font-size: 64px;
        }
      }
    `)
    const {className, classes} = renderer.root.findByType('div').props
    expect(className).to.be('scd-0 scd-d0-1')
    expect(classes).to.be(undefined)
  })

  it('should render a number of composed style rules with withStyles API', () => {
    const registry = new SheetsRegistry()
    const styles = {
      css: compose(space, color, fontSize, width, fontWeight, lineHeight)
    }

    const MyComponent = ({classes}) => <div className={classes.css} />

    const MyStyledComponent = withStyles(styles, {injectTheme: true})(MyComponent)

    const renderer = TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <ThemeProvider theme={theme}>
          <MyStyledComponent
            px={[3, 4]}
            py={[1, 2]}
            color="white"
            bg="blue"
            fontSize={[4, 5, 6]}
            fontWeight="bold"
          />
        </ThemeProvider>
      </JssProvider>
    )

    expect(registry.toString()).to.be(stripIndent`
      .css-0 {}
      .css-d0-1 {
        color: white;
        font-size: 32px;
        font-weight: bold;
        padding-top: 4px;
        padding-left: 16px;
        padding-right: 16px;
        padding-bottom: 4px;
        background-color: #07c;
      }
      @media screen and (min-width: 40em) {
        .css-d0-1 {
          font-size: 48px;
          padding-top: 8px;
          padding-left: 32px;
          padding-right: 32px;
          padding-bottom: 8px;
        }
      }
      @media screen and (min-width: 52em) {
        .css-d0-1 {
          font-size: 64px;
        }
      }
    `)
    const {className, classes} = renderer.root.findByType('div').props
    expect(className).to.be('css-0 css-d0-1')
    expect(classes).to.be(undefined)
  })

  it.skip('should handle the propTypes/meta for validation from function rules', () => {})

  it.skip('should do compose() automatically', () => {})
})
