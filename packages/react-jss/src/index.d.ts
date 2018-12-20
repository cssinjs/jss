import * as React from 'react'
import {
  StyleSheet,
  CreateGenerateId,
  GenerateId,
  Jss,
  SheetsRegistry,
  Styles,
  StyleSheetFactoryOptions
} from 'jss'

export const jss: Jss
export {SheetsRegistry}
export const createGenerateId: CreateGenerateId

export const JssProvider: React.ComponentType<{
  jss?: Jss
  registry?: SheetsRegistry
  generateId?: GenerateId
  classNamePrefix?: string
  disableStylesGeneration?: boolean
  children: React.ReactNode
}>

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
type Options = {
  index?: number
  injectTheme?: boolean
  jss?: Jss
} & StyleSheetFactoryOptions

type InjectedProps<Styles, Theme> = {
  classes: {[key in keyof Styles]: string}
  theme?: Theme
  sheet?: StyleSheet
}

export default function injectSheet<
  Style extends Styles,
  Theme extends object,
  Props extends InjectedProps<Styles, Theme>
>(
  styles: Style,
  options?: Options
): (
  comp: React.ComponentType<Props>
) => React.ComponentType<Omit<Props, InjectedProps<Styles, Theme>>>
