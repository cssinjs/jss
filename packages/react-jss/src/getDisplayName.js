// @flow
import type {ComponentType} from 'react'

export default <P>(Component: ComponentType<P>) =>
  Component.displayName || Component.name || 'Component'
