// @flow

import type {StyleSheet} from 'jss'
import type {StaticStyles} from '../types'

interface SheetMeta {
  styles: StaticStyles;
  dynamicStyles: StaticStyles;
  dynamicRuleCounter: number;
}

const sheetsMeta = new WeakMap<StyleSheet, SheetMeta>()

const getMeta = (sheet: StyleSheet) => {
  return sheetsMeta.get(sheet)
}

const addMeta = (sheet: StyleSheet, meta: SheetMeta) => {
  sheetsMeta.set(sheet, meta)
}

export {getMeta, addMeta}
