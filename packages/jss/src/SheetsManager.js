import warn from 'tiny-warning'

/**
 * SheetsManager is like a WeakMap which is designed to count StyleSheet
 * instances and attach/detach automatically.
 * Used in react-jss.
 */
export default class SheetsManager {
  length = 0

  sheets = new WeakMap()

  get size() {
    return this.length
  }

  get(key) {
    const entry = this.sheets.get(key)
    return entry && entry.sheet
  }

  add(key, sheet) {
    if (this.sheets.has(key)) return

    this.length++

    this.sheets.set(key, {
      sheet,
      refs: 0
    })
  }

  manage(key) {
    const entry = this.sheets.get(key)

    if (entry) {
      if (entry.refs === 0) {
        entry.sheet.attach()
      }

      entry.refs++

      return entry.sheet
    }

    warn(false, "[JSS] SheetsManager: can't find sheet to manage")

    return undefined
  }

  unmanage(key) {
    const entry = this.sheets.get(key)

    if (entry) {
      if (entry.refs > 0) {
        entry.refs--

        if (entry.refs === 0) entry.sheet.detach()
      }
    } else {
      warn(false, "SheetsManager: can't find sheet to unmanage")
    }
  }
}
