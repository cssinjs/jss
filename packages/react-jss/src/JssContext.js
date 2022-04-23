import * as React from 'react'
import isInBrowser from './utils/isInBrowser'

export default React.createContext({
  classNamePrefix: '',
  disableStylesGeneration: false,
  isSSR: !isInBrowser
})
