// @flow
import React, {type Context} from 'react'
import type {Context as JssContextValue} from './types'

const JssContext: Context<JssContextValue> = React.createContext({
  classNamePrefix: '',
  disableStylesGeneration: false
})

export default JssContext
