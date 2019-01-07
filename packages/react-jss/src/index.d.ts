import {ComponentType, ReactNode} from 'react'
import {
  CreateGenerateId,
  GenerateId,
  Jss,
  SheetsRegistry,
  Styles,
  StyleSheetFactoryOptions
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
}>

type ThemedStyles<Theme> = (theme: Theme) => Styles

interface WithStyles<S extends Styles | ThemedStyles<any>> {
  classes: Record<S extends ThemedStyles<any> ? keyof ReturnType<S> : keyof S, string>
}

interface Options<Theme> extends StyleSheetFactoryOptions {
  index?: number
  injectTheme?: boolean
  jss?: Jss
  theming: Theming<Theme>
}

declare function withStyles<Theme, S extends Styles | ThemedStyles<Theme>>(
  styles: S,
  options?: Options<Theme>
): <Props extends WithStyles<S>>(
  comp: ComponentType<Props>
) => ComponentType<Props & {classes?: Partial<Props['classes']>}>

export {
  SheetsRegistry,
  jss,
  createGenerateId,
  JssProvider,
  WithStyles,
  ThemeProvider,
  withTheme,
  createTheming
}

export default withStyles
