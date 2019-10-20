import {ComponentType, ReactNode, Context} from 'react'
import {
  CreateGenerateId,
  GenerateId,
  Jss,
  SheetsRegistry,
  Styles,
  StyleSheetFactoryOptions,
  CreateGenerateIdOptions,
  Classes
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

interface WithStylesProps<S extends Styles | ((theme: unknown) => Styles)> {
  classes: Classes<S extends ((theme: unknown) => Styles) ? keyof ReturnType<S> : keyof S>
}

interface WithStylesOptions extends StyleSheetFactoryOptions {
  index?: number
  injectTheme?: boolean
  jss?: Jss
  theming?: Theming<object>
}

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

declare function createUseStyles<
  Data = unknown,
  ClassNames extends string | number | symbol = string
>(
  styles: Styles<ClassNames, Data>,
  options?: {
    index?: number
    name?: string
  } & StyleSheetFactoryOptions
): (data?: Data) => Classes<ClassNames>

declare function createUseStyles<
  D = unknown,
  T = unknown,
  ClassNames extends string | number | symbol = string
>(
  styles: (theme: T) => Styles<ClassNames, D>,
  options?: {
    index?: number
    name?: string
    theming?: Theming<T>
  } & StyleSheetFactoryOptions
): (data?: D) => Classes<ClassNames>

declare function withStyles<Data = unknown, ClassNames extends string | number | symbol = string>(
  styles: Styles<ClassNames, Data>,
  options?: WithStylesOptions
): <Props extends {classes: Classes<ClassNames>}>(
  comp: ComponentType<Props>
) => ComponentType<Omit<Props, 'classes'> & {classes?: Partial<Props['classes']>}>

declare function withStyles<
  Data = unknown,
  Theme = unknown,
  ClassNames extends string | number | symbol = string
>(
  styles: (theme: Theme) => Styles<ClassNames, Data>,
  options?: WithStylesOptions
): <Props extends {classes: Classes<ClassNames>}>(
  comp: ComponentType<Props>
) => ComponentType<Omit<Props, 'classes'> & {classes?: Partial<Props['classes']>}>

export {
  SheetsRegistry,
  jss,
  createGenerateId,
  JssProvider,
  WithStylesProps,
  ThemeProvider,
  withTheme,
  createTheming,
  useTheme,
  JssContext,
  createUseStyles,
  Styles
}

export default withStyles
