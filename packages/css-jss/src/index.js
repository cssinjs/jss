// @flow
import {create as createJss} from 'jss'
import preset from 'jss-preset-default'
import createCss from './createCss'
import type {Css, Style} from './types'

const jss = createJss(preset())
const defaultSheet = jss.createStyleSheet().attach()

export type {Css, Style}
export {createCss as create}
export default createCss(defaultSheet)
