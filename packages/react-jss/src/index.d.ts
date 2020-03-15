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
/**
 * @deprecated Please use `WithStylesProps` instead
 */
type WithStyles<S extends Styles | ((theme: unknown) => Styles)> = WithStylesProps<S>

interface BaseOptions extends StyleSheetFactoryOptions {
  index?: number
  theming?: Theming<object>
}

interface WithStylesOptions extends BaseOptions {
  injectTheme?: boolean
  jss?: Jss
}

interface CreateUseStylesOptions extends BaseOptions {
  name?: string
}

export interface DefaultTheme {}

declare function createUseStyles<Theme = DefaultTheme, C extends string = string>(
  styles: Record<C, any> | ((theme: Theme) => Record<C, any>),
  options?: CreateUseStylesOptions
): (data?: unknown) => Classes<C>

declare function withStyles<
  ClassNames extends string | number | symbol,
  S extends Styles<ClassNames> | ((theme: any) => Styles<ClassNames>)
>(
  styles: S,
  options?: WithStylesOptions
): <
  Props extends {
    classes: S extends (theme: any) => Styles<ClassNames>
      ? Classes<keyof ReturnType<S>>
      : Classes<ClassNames>
  }
>(
  comp: ComponentType<Props>
) => ComponentType<Omit<Props, 'classes'> & {classes?: Partial<Props['classes']>}>

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

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
