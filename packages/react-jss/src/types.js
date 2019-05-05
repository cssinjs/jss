// @flow
import type {StyleSheetFactoryOptions, Jss, SheetsRegistry, SheetsManager, BaseRule} from 'jss'
import type {Node} from 'react'
import type {Theming} from 'theming'

export type StaticStyles = {[key: string]: {}}

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

export type HOCProps<Theme, Props> = Props & {|
  theme: Theme,
  jssContext: Context,
  innerRef: any
|}

export type InnerProps = {
  children?: Node,
  classes: {}
}

export type DynamicRules = {
  [key: string]: BaseRule
}

export type ThemedStyles<Theme> = (theme: Theme) => StaticStyles
export type Styles<Theme> = StaticStyles | ThemedStyles<Theme>
