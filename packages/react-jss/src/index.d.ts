import {ComponentType, ReactNode, Context, RefObject} from 'react'
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

interface WithStylesProps<S extends Styles | ((theme: any) => Styles)> {
  classes: Classes<S extends (theme: any) => Styles ? keyof ReturnType<S> : keyof S>
}
/**
 * @deprecated Please use `WithStylesProps` instead
 */
type WithStyles<S extends Styles | ((theme: any) => Styles)> = WithStylesProps<S>

export interface DefaultTheme {}

interface BaseOptions<Theme = DefaultTheme> extends StyleSheetFactoryOptions {
  index?: number
  theming?: Theming<Theme>
}

interface WithStylesOptions extends BaseOptions {
  injectTheme?: boolean
  jss?: Jss
}

interface CreateUseStylesOptions<Theme = DefaultTheme> extends BaseOptions<Theme> {
  name?: string
}

declare function createUseStyles<Theme = DefaultTheme, C extends string = string>(
  styles: Styles<C> | ((theme: Theme) => Styles<C>),
  options?: CreateUseStylesOptions<Theme>
): (data?: unknown) => Classes<C>

type GetProps<C> = C extends ComponentType<infer P> ? P : never

declare function withStyles<
  ClassNames extends string | number | symbol,
  S extends Styles<ClassNames> | ((theme: any) => Styles<ClassNames>)
>(
  styles: S,
  options?: WithStylesOptions
): <C>(
  comp: C
) => ComponentType<
  JSX.LibraryManagedAttributes<
    C,
    Omit<GetProps<C>, 'classes'> &
      Partial<WithStylesProps<S>> & {innerRef?: RefObject<any> | ((instance: any) => void)}
  >
>

export {
  SheetsRegistry,
  jss,
  createGenerateId,
  JssProvider,
  WithStylesProps,
  ThemeProvider,
  withTheme,
  createTheming,
  Theming,
  useTheme,
  JssContext,
  createUseStyles,
  Styles
}

export default withStyles
