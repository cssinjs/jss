/**
 * StyleSheets written in javascript.
 *
 * @copyright Oleg Slobodskoi 2014-2016
 * @website https://github.com/jsstyles/jss
 * @license MIT
 */

import createJss from './createJss'
import StyleSheet from './StyleSheet'

const jss = createJss()

// Hotfix for babel 5 migration, will be removed in version 4.0.0
module.exports = exports = jss

// For testing only.
export {
  StyleSheet
}

export default jss
