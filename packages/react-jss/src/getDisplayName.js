// @flow
import type {ComponentType} from 'react'

export default (Component: ComponentType<{}>) => Component.displayName || Component.name || 'Component'
