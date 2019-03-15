// @flow

import type {StyleSheet} from 'jss'
import type {DynamicRules} from '../types'
import {getMetaForSheet} from './sheets-meta'

const removeDynamicRules = (sheet: ?StyleSheet, rules: ?DynamicRules) => {
  if (!sheet || !rules) {
    return
  }

  // Loop over each dynamic rule and remove the dynamic rule
  // We can't just remove the whole sheet as this has all of the rules for every component instance
  for (const key in rules) {
    sheet.deleteRule(rules[key].key)
  }
}

const updateDynamicRules = (data: any, sheet: ?StyleSheet, rules: ?DynamicRules) => {
  if (!sheet || !rules) {
    return
  }

  // Loop over each dynamic rule and update it
  // We can't just update the whole sheet as this has all of the rules for every component instance
  for (const key in rules) {
    // $FlowFixMe
    sheet.update(rules[key].key, data)
  }
}

const addDynamicRules = (sheet: ?StyleSheet): ?DynamicRules => {
  if (!sheet) {
    return undefined
  }

  const meta = getMetaForSheet(sheet)

  if (!meta) {
    return undefined
  }

  const rules: DynamicRules = {}

  // Loop over each dynamic rule and add it to the stylesheet
  for (const key in meta.dynamicStyles) {
    const name = `${key}-${meta.dynamicRuleCounter++}`
    const rule = sheet.addRule(name, meta.dynamicStyles[key])

    if (rule) {
      rules[key] = rule
    }
  }

  return rules
}

export {addDynamicRules, updateDynamicRules, removeDynamicRules}
