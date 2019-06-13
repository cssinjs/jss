// @flow
import {create as createJss} from 'jss'
import type {StyleSheet} from 'jss'
import preset from 'jss-preset-default'
import createCss from './createCss'
import type {Css} from './createCss'

const jss = createJss(preset())
const defaultSheet = jss.createStyleSheet().attach()

export const create = (sheet: StyleSheet): Css => {
  // Since user decided to create own  style sheet, we can detach the default one.
  defaultSheet.detach()
  return createCss(sheet)
}

export default createCss(defaultSheet)
