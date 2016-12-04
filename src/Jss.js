/* @flow */

import StyleSheet from './StyleSheet'
import PluginsRegistry from './PluginsRegistry'
import internalPlugins from './plugins'
import sheets from './sheets'
import generateClassNameDefault from './utils/generateClassName'
import createRule from './utils/createRule'
import findRenderer from './utils/findRenderer'
import type {Plugin, PublicJssOptions, JssOptions, PublicStyleSheetOptions, RuleOptions} from './types'

declare var __VERSION__: string

export default class Jss {
  version = __VERSION__

  plugins = new PluginsRegistry()

  options: JssOptions

  constructor(options?: PublicJssOptions) {
    this.use.apply(this, internalPlugins) // eslint-disable-line prefer-spread
    this.setup(options)
  }

  setup(options?: PublicJssOptions = {}): Jss {
    this.options = {
      ...options,
      generateClassName: options.generateClassName || generateClassNameDefault
    }
    const {plugins} = this.options
    if (plugins) this.use.apply(this, plugins) // eslint-disable-line prefer-spread
    return this
  }

  /**
   * Create a style sheet.
   */
  createStyleSheet(styles: Object, options: PublicStyleSheetOptions): StyleSheet {
    options = {
      jss: this,
      generateClassName: this.options.generateClassName,
      ...options
    }
    return new StyleSheet(styles, options)
  }

  /**
   * Detach the style sheet and remove it from the registry.
   */
  removeStyleSheet(sheet: StyleSheet): Jss {
    sheet.detach()
    sheets.remove(sheet)
    return this
  }

  /**
   * Create a rule.
   */
  createRule(name?: string, style?: Object, options?: RuleOptions): Object {
    // Enable rule without name for inline styles.
    if (typeof name === 'object') {
      options = style
      style = name
      name = undefined
    }

    // Perf optimization, turns out to be important.
    const {Renderer, generateClassName} = options || {}
    if (!Renderer || !generateClassName) {
      options = {
        jss: this,
        Renderer: findRenderer(options),
        generateClassName: generateClassName || this.options.generateClassName,
        ...options
      }
    }

    const rule = createRule(name, style, options)
    this.plugins.onProcessRule(rule)

    return rule
  }

  /**
   * Register plugin. Passed function will be invoked with a rule instance.
   */
  use(...plugins: Array<Plugin>): Jss {
    plugins.forEach(plugin => this.plugins.use(plugin))
    return this
  }
}
