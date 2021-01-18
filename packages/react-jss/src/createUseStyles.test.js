/* eslint-disable react/prop-types */

import {createUseStyles} from '.'
import createCommonBaseTests from '../test-utils/createCommonBaseTests'

const createStyledComponent = (styles, options) => {
  const useStyles = createUseStyles(styles, options)
  const Comp = props => {
    useStyles(props)
    return null
  }
  return Comp
}

describe('React-JSS: createUseStyles', () => {
  createCommonBaseTests({createStyledComponent})
})
