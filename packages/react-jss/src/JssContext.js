// @flow
import * as React from 'react'
import type {Context as JssContextValue} from './types'

const JssContext: React.Context<JssContextValue> = React.createContext({
  classNamePrefix: '',
  disableStylesGeneration: false
})

export default JssContext
