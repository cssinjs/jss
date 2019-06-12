// @flow
import type {StyleSheetFactoryOptions, Jss, SheetsRegistry, SheetsManager, BaseRule} from 'jss'
import type {Node} from 'react'
import type {Theming} from 'theming'

export type Managers = {[key: number]: SheetsManager}

type StyleSheetOptions = {
  ...StyleSheetFactoryOptions,
  classNamePrefix: string
}

export type HookOptions<Theme> = StyleSheetFactoryOptions & {
  index?: number,
  name?: string,
  theming?: Theming<Theme>
}

export type HOCOptions<Theme> = StyleSheetFactoryOptions & {
  index?: number,
  theming?: Theming<Theme>,
  injectTheme?: boolean
}

export type Context = {|
  jss?: Jss,
  registry?: SheetsRegistry,
  managers?: Managers,
  sheetOptions: StyleSheetOptions,
  disableStylesGeneration: boolean
|}

export type HOCProps<Theme, Props> = Props & {
  theme: Theme,
  jssContext: Context,
  innerRef: any
}

export type Classes = {[string]: string}

export type InnerProps = {
  children?: Node,
  classes: Classes
}

export type DynamicRules = {
  [key: string]: BaseRule
}

export type StaticStyle = {}
export type DynamicStyle<Theme> = ({theme: Theme}) => StaticStyle

export type StaticStyles = {[key: string]: StaticStyle}

export type ThemedStyles<Theme> = (theme: Theme) => StaticStyle | DynamicStyle<Theme>

export type Styles<Theme> = StaticStyles | ThemedStyles<Theme>
