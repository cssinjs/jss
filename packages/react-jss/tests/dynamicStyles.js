/* eslint-disable react/prop-types */

import {createUseStyles} from '../src'
import createDynamicStylesTests from '../test-utils/createDynamicStylesTests'

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

describe('React-JSS: dynamic styles with createUseStyles', () => {
  createDynamicStylesTests({createStyledComponent})
})
