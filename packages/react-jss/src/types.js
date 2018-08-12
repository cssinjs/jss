// @flow
import type {StyleSheetFactoryOptions, Jss, SheetsRegistry, SheetsManager} from 'jss'
import type {ComponentType, Node, ElementRef} from 'react'

export type Theme = {}
export type SubscriptionId = string
type Theming = {
  channel: string,
  withTheme: <P>(comp: ComponentType<P>) => ComponentType<P & {theme: Theme}>,
  ThemeProvider: ComponentType<{
    theme: Theme | ((outerTheme: Theme) => Theme),
    children: Node
  }>,
  themeListener: {
    contextTypes: {},
    initial: (context: {}) => Theme,
    subscribe: (context: {}, cb: (theme: Theme) => void) => SubscriptionId,
    unsubscribe: (context: {}, id: SubscriptionId) => void
  }
}

export type Options = {
  theming?: Theming,
  inject?: Array<'classes' | 'themes' | 'sheet'>,
  jss?: Jss
} & StyleSheetFactoryOptions
export type InnerProps = {
  children?: Node,
  classes?: {},
  theme?: {},
  sheet?: {}
}
// Needs to be hard coded for stricter types
export type Context = {
  '64a55d578f856d258dc345b094a2a2b3'?: Jss,
  d4bd0baacbc52bbd48bbb9eb24344ecd?: SheetsRegistry,
  b768b78919504fba9de2c03545c5cd3a?: {[key: number]: SheetsManager},
  '6fc570d6bd61383819d0f9e7407c452d': StyleSheetFactoryOptions & {disableStylesGeneration?: boolean}
}
export type OuterProps<IP, C> = IP & {innerRef: (instance: ElementRef<C> | null) => void}
export type Styles = {[string]: {}}
export type ThemerFn = (theme: Theme) => Styles
export type StylesOrThemer = Styles | ThemerFn
