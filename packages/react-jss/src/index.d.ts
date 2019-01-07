import {ComponentType, ReactNode} from 'react'
import {
  CreateGenerateId,
  GenerateId,
  Jss,
  SheetsRegistry,
  Styles,
  StyleSheetFactoryOptions
} from 'jss'
import {ThemeProvider, withTheme, createTheming} from 'theming'

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

type ThemedStyles = (theme: any) => Styles

interface WithStyles<S extends Styles | ThemedStyles> {
  classes: Record<S extends ThemedStyles ? keyof ReturnType<S> : keyof S, string>
}

interface Options extends StyleSheetFactoryOptions {
  index?: number
  injectTheme?: boolean
  jss?: Jss
}

declare function withStyles<S extends Styles | ThemedStyles>(
  styles: S,
  options?: Options
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
