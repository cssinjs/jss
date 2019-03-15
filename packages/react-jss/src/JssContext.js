// @flow
import React, {type Context} from 'react'
import type {Context as JssContextValue} from './types'

export const JssContext: Context<JssContextValue> = React.createContext({
  sheetOptions: {classNamePrefix: ''},
  disableStylesGeneration: false
})
