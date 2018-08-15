// @flow
import {create} from 'jss'
import preset from 'jss-preset-default'

export {
  SheetsRegistry,
  getDynamicStyles,
  SheetsManager,
  createGenerateClassName as createGenerateClassNameDefault
} from 'jss'
export type {StyleSheet} from 'jss'

export default create(preset())
