/* eslint-disable react/prop-types */

import {createUseStyles, withStyles} from '../src'
import createDynamicStylesTests from '../test-utils/createDynamicStylesTests'

describe('React-JSS: dynamic styles', () => {
  describe('using createUseStyles', () => {
    const createStyledComponent = (styles, options = {}) => {
      const useStyles = createUseStyles(styles, options)
      const Comp = props => {
        const classes = useStyles(props)
        props.getClasses(classes)
        return null
      }
      Comp.displayName = options.name
      return Comp
    }

    createDynamicStylesTests({createStyledComponent})
  })

  describe('using withStyles', () => {
    const createStyledComponent = (styles, options = {}) => {
      const Comp = props => {
        props.getClasses(props.classes)
        return null
      }
      Comp.displayName = options.name
      return withStyles(styles, options)(Comp)
    }

    createDynamicStylesTests({createStyledComponent})
  })
})
