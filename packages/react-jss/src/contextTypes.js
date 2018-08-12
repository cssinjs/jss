// @flow
import PropTypes from 'prop-types'
import * as ns from './ns'
import propTypes from './propTypes'

export default {
  [ns.jss]: propTypes.jss,
  [ns.sheetOptions]: PropTypes.object,
  [ns.sheetsRegistry]: propTypes.registry,
  [ns.managers]: PropTypes.object
}
