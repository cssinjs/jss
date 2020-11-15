// @flow
import warn from 'tiny-warning'
import type StyleSheet from './StyleSheet'

/**
 * SheetsManager is like a WeakMap which is designed to count StyleSheet
 * instances and attach/detach automatically.
 */
export default class SheetsManager {
  length: number = 0

  sheets: WeakMap<
    Object,
    {
      refs: number,
      sheet: StyleSheet
    }
  > = new WeakMap()

  get size(): number {
    return this.length
  }

  get(key: Object): ?StyleSheet {
    const entry = this.sheets.get(key)
    return entry && entry.sheet
  }

  add(key: Object, sheet: StyleSheet) {
    if (this.sheets.has(key)) return

    this.length++

    this.sheets.set(key, {
      sheet,
      refs: 0
    })
  }

  manage(key: Object): ?StyleSheet {
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

  unmanage(key: Object) {
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
