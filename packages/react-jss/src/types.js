// @flow
import type {StyleSheetFactoryOptions, Jss, SheetsRegistry, SheetsManager, BaseRule} from 'jss'
import type {Node} from 'react'
import type {Theming} from 'theming'

export type Managers = {[key: number]: SheetsManager}

export type Options<Theme> = {|
  theming?: Theming<Theme>,
  injectTheme?: boolean,
  jss?: Jss,
  ...$Exact<StyleSheetFactoryOptions>
|}

export type Context = {|
  jss?: Jss,
  registry?: SheetsRegistry,
  managers?: Managers,
  sheetOptions: StyleSheetFactoryOptions,
  disableStylesGeneration: boolean
|}

export type HOCProps<Theme, Props> = Props & {
  theme?: Theme,
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

type StaticStyle = {}

type PropsWithTheme<Theme> = {theme: Theme}

export type Style<Theme> = StaticStyle | ((PropsWithTheme<Theme>) => StaticStyle)

type StaticStyles = {[key: string]: StaticStyle}

export type ThemedStyles<Theme> = (theme: Theme) => Style<Theme>

export type Styles<Theme> = StaticStyles | ThemedStyles<Theme>
