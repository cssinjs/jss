// @flow
import type {StyleSheetFactoryOptions, Jss, SheetsRegistry, SheetsManager} from 'jss'
import type {Node, ElementRef} from 'react'
import {type Theming} from 'theming'

export type Theme = {}

export type Options = {
  theming?: Theming<Theme>,
  injectTheme?: boolean,
  jss?: Jss
} & StyleSheetFactoryOptions
export type InnerProps = {
  children?: Node,
  classes?: {},
  theme?: Theme
}
// Needs to be hard coded for stricter types
export type Context = {
  jss?: Jss,
  registry?: SheetsRegistry,
  managers?: {[key: number]: SheetsManager},
  sheetOptions: StyleSheetFactoryOptions,
  disableStylesGeneration: boolean
}

export type OuterProps<Props, InnerComponent> = Context & {
  innerRef: (instance: ElementRef<InnerComponent>) => void
} & Props
export type Styles = {[string]: {}}
export type StylesCreator = (theme: Theme) => Styles
export type StylesOrCreator = Styles | StylesCreator
