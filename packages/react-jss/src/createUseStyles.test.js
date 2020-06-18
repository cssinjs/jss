/* eslint-disable react/prop-types */

import expect from 'expect.js'
import React from 'react'
import TestRenderer from 'react-test-renderer'
import {stripIndent} from 'common-tags'

import {SheetsRegistry, JssProvider, ThemeProvider, createUseStyles} from '.'

const createGenerateId = () => {
  let counter = 0
  return rule => `${rule.key}-${counter++}`
}

const theme: Object = {
  background: 'yellow',
  background2: 'red'
}

describe('React-JSS: createUseStyles', () => {
  it('should render multiple elements with applied media query', () => {
    const registry = new SheetsRegistry()
    const useStyles = createUseStyles(themeObj => ({
      wrapper: () => ({
        padding: 40,
        background: themeObj.background,
        textAlign: 'left',
        '@media (min-width: 1024px)': {
          backgroundColor: themeObj.background2
        }
      })
    }))

    const Comp = () => {
      const classes = useStyles(theme)
      return <div className={classes.wrapper} />
    }

    const a = [1, 2]
    TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <ThemeProvider theme={theme}>
          {a.map(item => (
            <Comp key={item} />
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
    }`)
  })
})
