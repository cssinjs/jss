/* @flow */
import type {ToCssOptions} from './types'
import type StyleSheet from './StyleSheet'

// 1. Use SheetsManager instance per createHoc
// 1. Use theme as a key
// 1. Handle dynamic styles
// 1. Remove support for StyleSheet instance from injectSheet
// 1. Use empty object as default for theme when used without styles creator

export default class SheetsManager {
  sheets: Array<StyleSheet> = []

  refs: Array<Number> = []

  keys: Array<Object> = []

  get(key) {
    const index = this.keys.indexOf(key)
    return this.sheets[index]
  }

  add(sheet: StyleSheet, key): number {
    const {sheets, refs, keys} = this
    const index = sheets.indexOf(sheet)

    if (index !== -1) return index

    sheets.push(sheet)
    refs.push(0)
    keys.push(key)

    return sheets.length - 1
  }

  manage(sheet, key) {
    const index = this.add(sheet, key)
    if (this.refs[index] === 0) sheet.attach()
    this.refs[index]++
    if (!this.keys[index]) this.keys.splice(index, 0, key)
  }

  unmanage(key) {
    const index = this.keys.indexOf(key)
    if (index === -1) {
      console.warn('SheetsManager: sheet not found by key', key)
      return
    }
    if (this.refs[index] > 0) {
      this.refs[index]--
      if (this.refs[index] === 0) this.sheets[index].detach()
    }
  }
}
