// @flow

import {SheetsManager, type StyleSheet} from 'jss'
import type {Context} from '../types'

const defaultManagers = new Map()

const getManager = (context: Context, managerId: number) => {
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

interface Options<Theme> {
  sheet: ?StyleSheet;
  context: Context;
  index: number;
  theme: Theme;
}

const manageSheet = <Theme>(options: Options<Theme>) => {
  const {sheet} = options
  if (!sheet) {
    return
  }

  const manager = getManager(options.context, options.index)

  manager.manage(options.theme)

  if (options.context.registry) {
    options.context.registry.add(sheet)
  }
}

const unmanageSheet = <Theme>(options: Options<Theme>) => {
  if (!options.sheet) {
    return
  }

  const manager = getManager(options.context, options.index)

  manager.unmanage(options.theme)
}

export {getManager, manageSheet, unmanageSheet}
