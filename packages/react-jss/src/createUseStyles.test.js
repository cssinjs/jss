/* eslint-disable react/prop-types */
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
})
