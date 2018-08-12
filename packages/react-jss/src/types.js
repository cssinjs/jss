// @flow
import type {StyleSheetFactoryOptions, Jss, SheetsRegistry, SheetsManager} from 'jss'
import type {ComponentType, Node, ElementRef} from 'react'

export type Options = {
  theming?: {
    channel?: '__THEMING__',
    withTheme?: (component: ComponentType<any>) => ComponentType<any>, // TODO: Accurate typing of this function, Function is unsafe typing
    ThemeProvider?: Function, // TODO: Accurate typing of this function, Function is unsafe typing
    themeListener?: () => {
      // TODO: Accurate typing of the returned object
      contextTypes: any,
      initial: any,
      subscribe: any,
      unsubscribe: any
    },
    createTheming?: {
      channel: string, // CustomChannel
      withTheme: any,
      ThemeProvider: any,
      themeListener: {
        // TODO: Accurate typing of the returned object
        contextTypes: any,
        initial: any,
        subscribe: any,
        unsubscribe: any
      }
    }
  },
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
  'd4bd0baacbc52bbd48bbb9eb24344ecd'?: SheetsRegistry,
  'b768b78919504fba9de2c03545c5cd3a'?: { [key: string]: SheetsManager },
  '6fc570d6bd61383819d0f9e7407c452d': StyleSheetFactoryOptions,
}
export type OuterProps<IP, C> = IP & {innerRef: (instance: ElementRef<C> | null) => void}
export type Theme = {}
export type Styles = {[string]: {}}
export type ThemerFn = (theme: Theme) => Styles
export type StylesOrThemer = Styles | ThemerFn
