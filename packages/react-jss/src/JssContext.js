import * as React from 'react'
import isInBrowser from 'is-in-browser'

export default React.createContext({
  classNamePrefix: '',
  disableStylesGeneration: false,
  isSSR: !isInBrowser
})
