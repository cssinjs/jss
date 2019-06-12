// @flow
import {create as createJss} from 'jss'
import preset from 'jss-preset-default'
import createCss from './createCss'
import createCache from './createCache'

const jss = createJss(preset())
const defaultSheet = jss.createStyleSheet().attach()

export const create = sheet => {
  // Since user decided to create own  style sheet, we can detach the default one.
  defaultSheet.detach()
  return createCss(sheet, createCache())
}

export default createCss(defaultSheet)
