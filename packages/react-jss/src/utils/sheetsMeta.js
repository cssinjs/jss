// @flow
import type {StyleSheet} from 'jss'
import type {StaticStyles} from '../types'

type SheetMeta = {|
  styles: StaticStyles,
  dynamicStyles: StaticStyles
|}

const sheetsMeta = new WeakMap<StyleSheet, SheetMeta>()

export const getMeta = (sheet: StyleSheet): SheetMeta | void => sheetsMeta.get(sheet)

export const addMeta = (sheet: StyleSheet, meta: SheetMeta) => {
  sheetsMeta.set(sheet, meta)
}
