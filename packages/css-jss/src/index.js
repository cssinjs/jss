// @flow
import createCss from './createCss'
import type {Css, Style} from './types'

export type {Css, Style}
export {createCss as create}
const css: Css = createCss()
export default css
