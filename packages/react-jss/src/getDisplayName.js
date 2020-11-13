// @flow
import type {ComponentType} from 'react'

type GetDisplayName = <Props>(ComponentType<Props>) => string

// eslint-disable-next-line no-unused-vars
const getDisplayName: GetDisplayName = <Props>(Component) =>
  Component.displayName || Component.name || 'Component'

export default getDisplayName
