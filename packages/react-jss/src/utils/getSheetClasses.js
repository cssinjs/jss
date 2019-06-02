// @flow

import type {StyleSheet} from 'jss'
import type {DynamicRules} from '../types'
import {getMeta} from './sheetsMeta'

const getSheetClasses = (sheet: StyleSheet, dynamicRules: ?DynamicRules) => {
  if (!dynamicRules) {
    return sheet.classes
  }

  const classes = {}
  const meta = getMeta(sheet)

  if (!meta) {
    return sheet.classes
  }

  for (const key in meta.styles) {
    classes[key] = sheet.classes[key]

    if (key in dynamicRules) {
      classes[key] += ` ${sheet.classes[dynamicRules[key].key]}`
    }
  }

  return classes
}

export default getSheetClasses
