import warning from 'tiny-warning'
import {getDynamicStyles} from 'jss'
import {getManager} from './managers'
import defaultJss from '../jss'
import {addMeta, getMeta} from './sheetsMeta'

const getStyles = (options) => {
  const {styles} = options
  if (typeof styles !== 'function') {
    return styles
  }

  warning(
    styles.length !== 0,
    `[JSS] <${
      options.name || 'Hook'
    } />'s styles function doesn't rely on the "theme" argument. We recommend declaring styles as an object instead.`
  )

  return styles(options.theme)
}

function getSheetOptions(options, link) {
  let minify
  if (options.context.id && options.context.id.minify != null) {
    minify = options.context.id.minify
  }

  let classNamePrefix = options.context.classNamePrefix || ''
  if (options.name && !minify) {
    classNamePrefix += `${options.name.replace(/\s/g, '-')}-`
  }

  let meta = ''
  if (options.name) meta = `${options.name}, `
  meta += typeof options.styles === 'function' ? 'Themed' : 'Unthemed'

  return {
    ...options.sheetOptions,
    index: options.index,
    meta,
    classNamePrefix,
    link,
    generateId:
      options.sheetOptions && options.sheetOptions.generateId
        ? options.sheetOptions.generateId
        : options.context.generateId
  }
}

export const createStyleSheet = (options) => {
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
    styles
  })

  manager.add(options.theme, sheet)

  return sheet
}

export const removeDynamicRules = (sheet, rules) => {
  // Loop over each dynamic rule and remove the dynamic rule
  // We can't just remove the whole sheet as this has all of the rules for every component instance
  for (const key in rules) {
    sheet.deleteRule(rules[key])
  }
}

export const updateDynamicRules = (data, sheet, rules) => {
  // Loop over each dynamic rule and update it
  // We can't just update the whole sheet as this has all of the rules for every component instance
  for (const key in rules) {
    sheet.updateOne(rules[key], data)
  }
}

export const addDynamicRules = (sheet, data) => {
  const meta = getMeta(sheet)

  if (!meta) {
    return undefined
  }

  const rules = {}

  // Loop over each dynamic rule and add it to the stylesheet
  for (const key in meta.dynamicStyles) {
    const initialRuleCount = sheet.rules.index.length
    const originalRule = sheet.addRule(key, meta.dynamicStyles[key])

    // Loop through all created rules, fixes updating dynamic rules
    for (let i = initialRuleCount; i < sheet.rules.index.length; i++) {
      const rule = sheet.rules.index[i]
      sheet.updateOne(rule, data)

      // If it's the original rule, we need to add it by the correct key so the hook and hoc
      // can correctly concat the dynamic class with the static one
      rules[originalRule === rule ? key : rule.key] = rule
    }
  }

  return rules
}
