import StyleSheet from './StyleSheet'
import createPluginsRegistry from './createPluginsRegistry'
import createSheetsRegistry from './createSheetsRegistry'
import {uid} from './utils'
import createRule from './createRule'
import findRenderer from './findRenderer'

export default function createJss() {
  const jss = {
    isJss: true,
    sheets: createSheetsRegistry(),
    plugins: createPluginsRegistry(),
    create: createJss,
    uid
  }

  /**
   * Create a stylesheet.
   *
   * @see StyleSheet
   */
  jss.createStyleSheet = (styles, options) => {
    const sheet = new StyleSheet(styles, {...options, jss})
    jss.sheets.add(sheet)
    return sheet
  }

  /**
   * Create a rule.
   *
   * @see createRule
   */
  jss.createRule = (selector, style, options) => {
    // Enable rule without selector.
    if (typeof selector == 'object') {
      options = style
      style = selector
      selector = null
    }
    const rule = createRule(selector, style, {
      ...options,
      jss,
      Renderer: findRenderer(options)
    })
    jss.plugins.run(rule)
    return rule
  }

  /**
   * Register plugin. Passed function will be invoked with a rule instance.
   *
   * @param {Function} plugins
   * @api public
   */
  jss.use = (...plugins) => {
    plugins.forEach(plugin => jss.plugins.use(plugin))
    return jss
  }

  return jss
}
