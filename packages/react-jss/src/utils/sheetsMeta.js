// @flow
import type {StyleSheet} from 'jss'
import type {StaticStyles, DynamicStyle} from '../types'

type SheetMeta<Data = {}> = {|
  styles: $ReadOnly<StaticStyles>,
  dynamicStyles: $ReadOnly<{[key: string]: DynamicStyle<Data>}> | null
|}

const sheetsMeta = new WeakMap<StyleSheet, SheetMeta<any>>()

export const getMeta = <Data>(sheet: StyleSheet): SheetMeta<Data> | void => sheetsMeta.get(sheet)

export const addMeta = <Data>(sheet: StyleSheet, meta: SheetMeta<Data>) => {
  sheetsMeta.set(sheet, meta)
}
