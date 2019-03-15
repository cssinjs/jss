// @flow

import type {StyleSheet} from 'jss'
import type {StaticStyles} from '../types'

interface SheetMeta {
  styles: StaticStyles;
  dynamicStyles: StaticStyles;
  dynamicRuleCounter: number;
}

const sheetsMeta = new WeakMap<StyleSheet, SheetMeta>()

function getMetaForSheet(sheet: StyleSheet) {
  return sheetsMeta.get(sheet)
}

function addMetaForSheet(sheet: StyleSheet, meta: SheetMeta) {
  sheetsMeta.set(sheet, meta)
}

export {getMetaForSheet, addMetaForSheet}
