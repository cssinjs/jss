/* eslint-disable react/prop-types */

import * as React from 'react'
import {renderToString} from 'react-dom/server'
import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import createCommonBaseTests from '../test-utils/createCommonBaseTests'
import {createUseStyles, JssProvider, SheetsRegistry} from '.'
import {resetSheets} from '../../../tests/utils'

const createStyledComponent = (styles, options) => {
  const useStyles = createUseStyles(styles, options)
  const Comp = props => {
    useStyles(props)
    return null
  }
  return Comp
}

describe('React-JSS: createUseStyles', () => {
  beforeEach(resetSheets())
  createCommonBaseTests({createStyledComponent})

  describe('theme prop', () => {
    it('should pass theme from props priority', () => {
      const registry = new SheetsRegistry()

      const styles = theme => ({
        button: {color: theme.exampleColor || 'green'}
      })

      const MyComponent = createStyledComponent(styles)

      renderToString(
        <JssProvider registry={registry} generateId={() => 'button'}>
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
})
