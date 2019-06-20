import expect from 'expect.js'
import React from 'react'
import {renderToString} from 'react-dom/server'

import injectSheet, {createUseStyles, createGenerateId, JssProvider, SheetsRegistry} from '../src'

describe('React-JSS: rendering in an SSR context', () => {
  const staticStyles = {
    rule: {
      color: 'red'
    }
  }

  const testServerRender = Component => {
    const registry = new SheetsRegistry()
    const generateId = createGenerateId()
    const html = renderToString(
      <JssProvider registry={registry} generateId={generateId}>
        <Component />
      </JssProvider>
    )
    expect(html).to.be('')
    const css = registry.toString()
    expect(css).to.be('.Component-rule-1-1-1 {\n  color: red;\n}')
  }

  it('should render sheet on the server with withStyles', () => {
    const Component = () => null
    const StyledComponent = injectSheet(staticStyles)(Component)
    testServerRender(StyledComponent)
  })

  it('should render sheet on the server with useStyles', () => {
    const useStyles = createUseStyles(staticStyles, {name: 'Component'})
    const Component = props => {
      useStyles(props)
      return null
    }
    testServerRender(Component)
  })
})
