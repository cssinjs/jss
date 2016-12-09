/* @flow */
import StyleSheet from './StyleSheet'
import PluginsRegistry from './PluginsRegistry'
import internalPlugins from './plugins'
import sheets from './sheets'
import generateClassNameDefault from './utils/generateClassName'
import createRule from './utils/createRule'
import findRenderer from './utils/findRenderer'
import type {
  Rule,
  RuleOptions,
  StyleSheetOptions,
  Plugin,
  JssOptions
} from './types'

declare var __VERSION__: string

export default class Jss {
  version = __VERSION__

  plugins = new PluginsRegistry()

  options: JssOptions

  constructor(options?: JssOptions) {
    this.use.apply(this, internalPlugins) // eslint-disable-line prefer-spread
    this.setup(options)
  }

  setup(options?: JssOptions = {}): this {
    this.options = {
      ...options,
      generateClassName: options.generateClassName || generateClassNameDefault
    }
    const {plugins} = this.options
    if (plugins) this.use.apply(this, plugins) // eslint-disable-line prefer-spread
    return this
  }

  /**
   * Create a Style Sheet.
   */
  createStyleSheet(styles: Object, options: StyleSheetOptions): StyleSheet {
    return new StyleSheet(styles, {
      jss: (this: Jss),
      generateClassName: this.options.generateClassName,
      ...options
    })
  }

  /**
   * Detach the Style Sheet and remove it from the registry.
   */
  removeStyleSheet(sheet: StyleSheet): this {
    sheet.detach()
    sheets.remove(sheet)
    return this
  }

  /**
   * Create a rule without a Style Sheet.
   */
  createRule(name?: string, style?: Object = {}, options?: RuleOptions = {}): Rule {
    // Enable rule without name for inline styles.
    if (typeof name === 'object') {
      options = style
      style = name
      name = undefined
    }

    if (!options.classes) options.classes = {}
    if (!options.jss) options.jss = this
    if (!options.Renderer) options.Renderer = findRenderer(options)
    if (!options.generateClassName) {
      options.generateClassName = this.options.generateClassName || generateClassNameDefault
    }

    const rule = createRule(name, style, options)
    this.plugins.onProcessRule(rule)

    return rule
  }

  /**
   * Register plugin. Passed function will be invoked with a rule instance.
   */
  use(...plugins: Array<Plugin>): this {
    plugins.forEach(plugin => this.plugins.use(plugin))
    return this
  }
}
