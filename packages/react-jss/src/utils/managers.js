// @flow

import {SheetsManager} from 'jss'
import type {Context} from '../types'

const defaultManagers = new Map();

function getManager(context: Context, managerId: number) {
  // If `managers` map is present in the context, we use it in order to
  // let JssProvider reset them when new response has to render server-side.
  if (context.managers) {
    if (!context.managers[managerId]) {
      context.managers[managerId] = new SheetsManager()
    }
    return context.managers[managerId]
  }

  let manager = defaultManagers.get(managerId);

  if (!manager) {
    manager = new SheetsManager();
    defaultManagers.set(managerId, manager);
  }

  return manager;
}

export {
  getManager,
}
