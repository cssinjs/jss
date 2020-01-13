/* eslint-disable react/prop-types */

import React from 'react'
import TestRenderer from 'react-test-renderer'
import expect from 'expect.js'
import createUseStyles from './createUseStyles'
import createBasicTests from '../test-utils/createBasicTests'

const createStyledComponent = (styles, options) => {
  const useStyles = createUseStyles(styles, options)
  const Comp = props => {
    useStyles(props)
    return null
  }
  return Comp
}

describe('React-JSS: createUseStyles', () => {
  createBasicTests({createStyledComponent})

  describe('options.generateId render as expect', () => {
    it('use passed options.generateId', () => {
      const useCustom = styles =>
        createUseStyles(styles, {
          generateId: rule => `ui-${rule.key}`
        })

      const useStyles = useCustom({
        button: {
          color: 'red'
        }
      })

      const StyledComponent = props => {
        const classes = useStyles(props)

        return <button className={classes.button} type="button" />
      }

      const renderer = TestRenderer.create(<StyledComponent />)

      expect(renderer.toJSON().props.className).equal('ui-button')
    })
  })
})
