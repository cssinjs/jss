import * as React from 'react'
import {CreateGenerateId, GenerateId, Jss, SheetsRegistry} from 'jss'
import {ThemeProvider, withTheme, createTheming} from 'theming'

export const jss: Jss
export {SheetsRegistry}
export const createGenerateId: CreateGenerateId
export {ThemeProvider, withTheme, createTheming}

export const JssProvider: React.ComponentType<{
  jss?: Jss
  registry?: SheetsRegistry
  generateId?: GenerateId
  classNamePrefix?: string
  disableStylesGeneration?: boolean
  children: React.ReactNode
}>
