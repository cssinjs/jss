// @flow
import warning from 'tiny-warning'
import {getDynamicStyles, type StyleSheetFactoryOptions} from 'jss'
import type {StyleSheet} from 'jss'
import type {Context, DynamicRules, Styles} from '../types'
import {getManager} from './managers'
import defaultJss from '../jss'
import {addMeta, getMeta} from './sheetsMeta'

interface Options<Theme> {
  context: Context;
  theme: Theme;
  name: string;
  index: number;
  styles: Styles<Theme>;
  sheetOptions: $Diff<StyleSheetFactoryOptions, {index: number | void}>;
}

const getStyles = <Theme>(options: Options<Theme>) => {
  const {styles} = options
  if (typeof styles !== 'function') {
    return styles
  }

  warning(
    styles.length !== 0,
    `[JSS] <${
      options.name
    } />'s styles function doesn't rely on the "theme" argument. We recommend declaring styles as an object instead.`
  )

  return styles(options.theme)
}

function getSheetOptions<Theme>(options: Options<Theme>, link: boolean) {
  let classNamePrefix

  if (options.context.sheetOptions.classNamePrefix !== false) {
    const prefix = `${options.name.replace(/\s/g, '-')}-`
    classNamePrefix = options.context.sheetOptions.classNamePrefix + prefix
  }

  return {
    ...options.sheetOptions,
    ...options.context.sheetOptions,
    index: options.index,
    meta: `${options.name}, ${typeof options.styles === 'function' ? 'Themed' : 'Unthemed'}`,
    classNamePrefix,
    link
  }
}

function createStaticSheet<Theme>(options: Options<Theme>) {
  if (options.context.disableStylesGeneration) {
    return undefined
  }

  const manager = getManager(options.context, options.index)
  const existingSheet = manager.get(options.theme)

  if (existingSheet) {
    return existingSheet
  }

  const jss = options.context.jss || defaultJss
  const styles = getStyles(options)
  const dynamicStyles = getDynamicStyles(styles)
  const sheet = jss.createStyleSheet(styles, getSheetOptions(options, dynamicStyles !== null))

  addMeta(sheet, {
    dynamicStyles,
    styles,
    dynamicRuleCounter: 0
  })

  manager.add(options.theme, sheet)

  return sheet
}

const removeDynamicRules = (sheet: StyleSheet, rules: DynamicRules) => {
  // Loop over each dynamic rule and remove the dynamic rule
  // We can't just remove the whole sheet as this has all of the rules for every component instance
  for (const key in rules) {
    sheet.deleteRule(rules[key].key)
  }
}

const updateDynamicRules = (data: any, sheet: StyleSheet, rules: DynamicRules) => {
  // Loop over each dynamic rule and update it
  // We can't just update the whole sheet as this has all of the rules for every component instance
  for (const key in rules) {
    // $FlowFixMe
    sheet.update(rules[key].key, data)
  }
}

const addDynamicRules = (sheet: StyleSheet, data: any): ?DynamicRules => {
  const meta = getMeta(sheet)

  if (!meta) {
    return undefined
  }

  const rules: DynamicRules = {}

  // Loop over each dynamic rule and add it to the stylesheet
  for (const key in meta.dynamicStyles) {
    const name = `${key}-${meta.dynamicRuleCounter++}`
    const rule = sheet.addRule(name, meta.dynamicStyles[key])

    sheet.update(name, data)

    if (rule) {
      rules[key] = rule
    }
  }

  return rules
}

export {addDynamicRules, updateDynamicRules, removeDynamicRules, createStaticSheet}
