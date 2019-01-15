// @flow
import type {StyleSheetFactoryOptions, Jss, SheetsRegistry, SheetsManager} from 'jss'
import type {Node} from 'react'
import type {Theming} from 'theming'

type StaticStyles = {[key: string]: {}}

export type Managers = {[key: number]: SheetsManager}

export type Options<Theme> = {
  theming?: Theming<Theme>,
  injectTheme?: boolean,
  jss?: Jss
} & StyleSheetFactoryOptions

export type Context = {
  jss?: Jss,
  registry?: SheetsRegistry,
  managers?: Managers,
  sheetOptions: StyleSheetFactoryOptions,
  disableStylesGeneration: boolean
}

export type HOCProps<Theme, Props> = Props & {
  theme?: Theme,
  jssContext: Context,
  innerRef: any
}

export type InnerProps = {
  children?: Node,
  classes: {}
}

export type ThemedStyles<Theme> = (theme: Theme) => StaticStyles
export type Styles<Theme> = StaticStyles | ThemedStyles<Theme>
