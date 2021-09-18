import {SheetsManager} from 'jss'

const defaultManagers = new Map()

export const getManager = (context, managerId) => {
  // If `managers` map is present in the context, we use it in order to
  // let JssProvider reset them when new response has to render server-side.
  const {managers} = context
  if (managers) {
    if (!managers[managerId]) {
      managers[managerId] = new SheetsManager()
    }
    return managers[managerId]
  }

  let manager = defaultManagers.get(managerId)

  if (!manager) {
    manager = new SheetsManager()
    defaultManagers.set(managerId, manager)
  }

  return manager
}

export const manageSheet = (options) => {
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

export const unmanageSheet = (options) => {
  if (!options.sheet) {
    return
  }

  const manager = getManager(options.context, options.index)

  manager.unmanage(options.theme)
}
