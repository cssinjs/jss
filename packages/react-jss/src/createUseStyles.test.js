/* eslint-disable react/prop-types */

import {createUseStyles} from '.'
import createCommonTests from '../test-utils/createCommonTests'

const createStyledComponent = (styles, options) => {
  const useStyles = createUseStyles(styles, options)
  const Comp = props => {
    useStyles(props)
    return null
  }
  return Comp
}

describe('React-JSS: createUseStyles', () => {
  createCommonTests({createStyledComponent})
})
