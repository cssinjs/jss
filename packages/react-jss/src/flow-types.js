// @flow
import type {
  StyleSheetFactoryOptions,
  Jss,
  SheetsRegistry,
  SheetsManager,
  BaseRule,
  CreateGenerateIdOptions,
  GenerateId
} from 'jss'
import type {Node} from 'react'
import type {Theming} from 'theming'

export type Managers = {[key: number]: SheetsManager}

export type HookOptions<Theme> = {|
  ...StyleSheetFactoryOptions,
  index?: number,
  name?: string,
  theming?: Theming<Theme>
|}

export type HOCOptions<Theme> = {|
  ...StyleSheetFactoryOptions,
  index?: number,
  theming?: Theming<Theme>,
  injectTheme?: boolean
|}

export type Context = {|
  jss?: Jss,
  registry?: SheetsRegistry,
  managers?: Managers,
  id?: CreateGenerateIdOptions,
  classNamePrefix?: string,
  disableStylesGeneration?: boolean,
  media?: string,
  generateId?: GenerateId,
  isSSR?: boolean
|}

export type HOCProps<Theme, Props> = Props & {
  theme: Theme,
  jssContext: Context,
  innerRef: any
}

export type Classes = {[string]: string}

export type InnerProps = {
  children?: Node,
  classes: Classes
}

export type DynamicRules = {
  [key: string]: BaseRule
}

export type StaticStyle = {}
export type DynamicStyle<Data> = (data: Data) => StaticStyle

export type StaticStyles = {[key: string]: StaticStyle}

export type StaticOrDynamicStyles<Data> = {[key: string]: StaticStyle | DynamicStyle<Data>}

export type ThemedStyles<Theme, Data = {}> = (theme: Theme) => {
  [key: string]: StaticStyle | DynamicStyle<Data>
}

export type Styles<Theme> = StaticStyles | ThemedStyles<Theme>
