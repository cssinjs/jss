// @flow

import {SheetsManager, type StyleSheet} from 'jss'
import type {Context} from '../types'

type Options<Theme> = {
  sheet: StyleSheet,
  context: Context,
  index: number,
  theme: Theme
}

const defaultManagers = new Map()

type GetManager = (Context, number) => SheetsManager

export const getManager: GetManager = (context, managerId) => {
  // If `managers` map is present in the context, we use it in order to
  // let JssProvider reset them when new response has to render server-side.
  if (context.managers) {
    if (!context.managers[managerId]) {
      context.managers[managerId] = new SheetsManager()
    }
    return context.managers[managerId]
  }

  let manager = defaultManagers.get(managerId)

  if (!manager) {
    manager = new SheetsManager()
    defaultManagers.set(managerId, manager)
  }

  return manager
}

export const manageSheet = <Theme>(options: Options<Theme>) => {
  const {sheet, context, index, theme} = options
  if (!sheet) {
    return
  }

  const manager = getManager(context, index)
  manager.manage(theme)
  if (context.registry) {
    context.registry.add(sheet)
  }
}

export const unmanageSheet = <Theme>(options: Options<Theme>) => {
  if (!options.sheet) {
    return
  }

  const manager = getManager(options.context, options.index)

  manager.unmanage(options.theme)
}
