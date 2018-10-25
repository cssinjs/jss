// @flow
import type {StyleSheet, StyleSheetFactoryOptions, Jss, SheetsRegistry, SheetsManager} from 'jss'
import type {Node, ElementRef} from 'react'
import type {Theming} from 'theming'

export type Theme = {}

export type Options = {
  theming?: Theming,
  inject?: Array<'classes' | 'themes' | 'sheet'>,
  jss?: Jss
} & StyleSheetFactoryOptions
export type InnerProps = {
  children?: Node,
  classes?: {},
  theme: Theme,
  sheet?: StyleSheet | null
}
// Needs to be hard coded for stricter types
export type Context = {
  '64a55d578f856d258dc345b094a2a2b3'?: Jss,
  d4bd0baacbc52bbd48bbb9eb24344ecd?: SheetsRegistry,
  b768b78919504fba9de2c03545c5cd3a?: {[key: number]: SheetsManager},
  '6fc570d6bd61383819d0f9e7407c452d': StyleSheetFactoryOptions & {disableStylesGeneration?: boolean}
}

export type OuterProps<Props, InnerComponent> = Props & {
  innerRef: (instance: ElementRef<InnerComponent> | null) => void
}
export type Styles = {[string]: {}}
export type StylesCreator = (theme: Theme) => Styles
export type StylesOrCreator = Styles | StylesCreator
