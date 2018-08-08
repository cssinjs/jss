// @flow
import type {StyleSheetOptions} from 'jss'
import jss from '../jss'

export type Options = {
  theming?: {
    themeListener: any => any
  },
  inject?: Array<'classes' | 'themes' | 'sheet'>,
  jss?: jss,
  ...$Shape<StyleSheetOptions>
}
export type Theme = {}
export type Styles = {[string]: {}}
export type ThemerFn = (theme: Theme) => Styles
export type StylesOrThemer = Styles | ThemerFn
export type Classes<S> = {|
  [$Keys<S>]: string
|}
