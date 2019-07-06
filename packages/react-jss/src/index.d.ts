import {ComponentType, ReactNode, Context} from 'react'
import {
  CreateGenerateId,
  GenerateId,
  Jss,
  SheetsRegistry,
  Styles,
  StyleSheetFactoryOptions,
  CreateGenerateIdOptions,
  Classes,
  Style
} from 'jss'
import {createTheming, useTheme, withTheme, ThemeProvider, Theming} from 'theming'

declare const jss: Jss

declare const createGenerateId: CreateGenerateId

declare const JssProvider: ComponentType<{
  jss?: Jss
  registry?: SheetsRegistry
  generateId?: GenerateId
  classNamePrefix?: string
  disableStylesGeneration?: boolean
  children: ReactNode
  id?: CreateGenerateIdOptions
}>

interface Managers {
  [key: number]: StyleSheet
}

declare const JssContext: Context<{
  jss?: Jss
  registry?: SheetsRegistry
  managers?: Managers
  sheetOptions: StyleSheetFactoryOptions
  disableStylesGeneration: boolean
}>

type ThemedStyles<Theme> = (theme: Theme) => Styles<string>

interface WithStyles<S extends Styles<string> | ThemedStyles<any>> {
  classes: Classes<S extends ThemedStyles<any> ? keyof ReturnType<S> : keyof S>
}

interface WithStylesOptions extends StyleSheetFactoryOptions {
  index?: number
  injectTheme?: boolean
  jss?: Jss
  theming?: Theming<object>
}

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

export {Styles}

declare function createUseStyles<C extends string>(
  styles: Record<C, Style | string>,
  options?: {
    index?: number
    name?: string
  } & StyleSheetFactoryOptions
): (data?: any) => Record<C, string>

declare function createUseStyles<T, C extends string>(
  styles: (theme: T) => Record<C, Style | string>,
  options?: {
    index?: number
    name?: string
    theming?: Theming<T>
  } & StyleSheetFactoryOptions
): (data?: any) => Record<C, string>

declare function withStyles<S extends Styles<string> | ThemedStyles<any>>(
  styles: S,
  options?: WithStylesOptions
): <Props extends WithStyles<S>>(
  comp: ComponentType<Props>
) => ComponentType<Omit<Props, 'classes'> & {classes?: Partial<Props['classes']>}>

export {
  SheetsRegistry,
  jss,
  createGenerateId,
  JssProvider,
  WithStyles,
  ThemeProvider,
  withTheme,
  createTheming,
  useTheme,
  JssContext,
  createUseStyles
}

export default withStyles
