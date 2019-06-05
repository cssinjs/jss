/* eslint-disable react/prop-types */

import {createUseStyles, withStyles} from '../src'
import createThemingTests from '../test-utils/createThemingTests'

describe('React-JSS: theming', () => {
  describe.skip('using createUseStyles', () => {
    const createStyledComponent = (styles, options = {}) => {
      const useStyles = createUseStyles(styles, options)
      const Comp = props => {
        const {theme} = useStyles(props)
        if (props.getTheme) props.getTheme(theme)
        return null
      }
      Comp.displayName = options.name
      return Comp
    }

    createThemingTests({createStyledComponent})
  })

  describe('using withStyles', () => {
    const createStyledComponent = (styles, options = {}) => {
      const Comp = ({getTheme, theme}) => {
        if (getTheme) getTheme(theme)
        return null
      }
      return withStyles(styles, options)(Comp)
    }

    createThemingTests({createStyledComponent})
  })
})
