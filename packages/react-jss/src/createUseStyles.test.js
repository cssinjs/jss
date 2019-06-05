/* eslint-disable react/prop-types */

import createUseStyles from './createUseStyles'
import createHocAndHooksTests from '../test-utils/createHocAndHooksTests'

const createStyledComponent = (styles, options) => {
  const useStyles = createUseStyles(styles, options)
  const Comp = props => {
    useStyles(props)
    return null
  }
  return Comp
}

describe('React-JSS: createUseStyles', () => {
  createHocAndHooksTests({createStyledComponent})
})
