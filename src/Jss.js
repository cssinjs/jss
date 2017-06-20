/* @flow */
import StyleSheet from './StyleSheet'
import PluginsRegistry from './PluginsRegistry'
import rulesPlugins from './plugins/rules'
import sheets from './sheets'
import createGenerateClassNameDefault from './utils/createGenerateClassName'
import createRule from './utils/createRule'
import findRenderer from './utils/findRenderer'
import type {
  Rule,
  RuleFactoryOptions,
  RuleOptions,
  StyleSheetFactoryOptions,
  Plugin,
  JssOptions,
  InternalJssOptions,
  JssStyle,
  generateClassName
} from './types'

declare var __VERSION__: string

export default class Jss {
  version = __VERSION__

  plugins = new PluginsRegistry()

  options: InternalJssOptions

  generateClassName: generateClassName

  constructor(options?: JssOptions) {
    // eslint-disable-next-line prefer-spread
    this.use.apply(this, rulesPlugins)
    this.setup(options)
  }

  setup(options?: JssOptions = {}): this {
    const createGenerateClassName =
      options.createGenerateClassName ||
      createGenerateClassNameDefault
    this.generateClassName = createGenerateClassName()
    this.options = {
      ...options,
      createGenerateClassName,
      Renderer: findRenderer(options)
    }
    // eslint-disable-next-line prefer-spread
    if (options.plugins) this.use.apply(this, options.plugins)
    return this
  }

  /**
   * Create a Style Sheet.
   */
  createStyleSheet(styles: Object, options: StyleSheetFactoryOptions = {}): StyleSheet {
    let index = options.index
    if (typeof index !== 'number') {
      index = sheets.index === 0 ? 0 : sheets.index + 1
    }
    const sheet = new StyleSheet(styles, {
      ...options,
      jss: (this: Jss),
      generateClassName: options.generateClassName || this.generateClassName,
      insertionPoint: this.options.insertionPoint,
      Renderer: this.options.Renderer,
      index
    })
    this.plugins.onProcessSheet(sheet)
    return sheet
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
  createRule(name?: string, style?: JssStyle = {}, options?: RuleFactoryOptions = {}): Rule {
    // Enable rule without name for inline styles.
    if (typeof name === 'object') {
      options = style
      style = name
      name = undefined
    }

    // Cast from RuleFactoryOptions to RuleOptions
    // https://stackoverflow.com/questions/41328728/force-casting-in-flow
    const ruleOptions: RuleOptions = (options: any)

    ruleOptions.jss = this
    ruleOptions.Renderer = this.options.Renderer
    if (!ruleOptions.generateClassName) ruleOptions.generateClassName = this.generateClassName
    if (!ruleOptions.classes) ruleOptions.classes = {}
    const rule = createRule(name, style, ruleOptions)
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
