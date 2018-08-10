// @flow
import type {StyleSheetOptions, Jss} from 'jss'
import type {ComponentType} from 'react'

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
} & StyleSheetOptions
export type Theme = {}
export type Styles = {[string]: {}}
export type ThemerFn = (theme: Theme) => Styles
export type StylesOrThemer = Styles | ThemerFn
