// @flow
import type {StyleSheet} from 'jss'
import type {StaticStyles, DynamicStyle} from '../types'

type SheetMeta<Theme> = {|
  styles: $ReadOnly<StaticStyles>,
  dynamicStyles: $ReadOnly<{[key: string]: DynamicStyle<Theme>}>
|}

const sheetsMeta = new WeakMap<StyleSheet, SheetMeta<any>>()

export const getMeta = <Theme>(sheet: StyleSheet): SheetMeta<Theme> | void => sheetsMeta.get(sheet)

export const addMeta = <Theme>(sheet: StyleSheet, meta: SheetMeta<Theme>) => {
  sheetsMeta.set(sheet, meta)
}
