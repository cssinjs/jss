import {object} from 'prop-types'
import * as ns from './ns'
import propTypes from './propTypes'

export default {
  [ns.jss]: propTypes.jss,
  [ns.sheetOptions]: object,
  [ns.sheetsRegistry]: propTypes.registry,
  [ns.managers]: object
}
