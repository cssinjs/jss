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
import {ThemeProvider, withTheme, createTheming, Theming} from 'theming'

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
  theming: Theming<object>
}

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

interface CreateUseStylesOptions<Theme> {
  index?: number
  name?: string
  theming?: Theming<Theme>
}

declare function createUseStyles<T, S extends Styles<string> | ThemedStyles<T>>(
  styles: S,
  options?: CreateUseStylesOptions<T>
): (data: any) => Classes<S extends ThemedStyles<T> ? keyof ReturnType<S> : keyof S>

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
  JssContext,
  createUseStyles
}

export default withStyles
