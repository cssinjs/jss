/* @flow */
import isInBrowser from 'is-in-browser'
import StyleSheet from './StyleSheet'
import PluginsRegistry from './PluginsRegistry'
import sheets from './sheets'
import {plugins as defaultPlugins, StyleRule, KeyframesRule} from './plugins'
import createGenerateClassNameDefault from './utils/createGenerateClassName'
import createRule from './utils/createRule'
import DomRenderer from './renderers/DomRenderer'
import VirtualRenderer from './renderers/VirtualRenderer'
import type {
  Rule,
  RuleFactoryOptions,
  RuleOptions,
  StyleSheetFactoryOptions,
  Plugin,
  JssOptions,
  InternalJssOptions,
  JssStyle,
  GenerateClassName
} from './types'

let instanceCounter = 0

export default class Jss {
  id = instanceCounter++

  version = process.env.VERSION

  plugins = new PluginsRegistry()

  options: InternalJssOptions = {
    createGenerateClassName: createGenerateClassNameDefault,
    Renderer: isInBrowser ? DomRenderer : VirtualRenderer,
    plugins: []
  }

  generateClassName: GenerateClassName = createGenerateClassNameDefault()

  constructor(options?: JssOptions) {
    // eslint-disable-next-line prefer-spread
    this.use.apply(this, defaultPlugins)
    this.setup(options)
  }

  /**
   * Prepares various options, applies plugins.
   * Should not be used twice on the same instance, because there is no plugins
   * deduplication logic.
   */
  setup(options?: JssOptions = {}): this {
    if (options.createGenerateClassName) {
      this.options.createGenerateClassName = options.createGenerateClassName
      // $FlowFixMe
      this.generateClassName = options.createGenerateClassName()
    }

    if (options.insertionPoint != null) this.options.insertionPoint = options.insertionPoint
    if (options.virtual || options.Renderer) {
      this.options.Renderer = options.Renderer || (options.virtual ? VirtualRenderer : DomRenderer)
    }

    // eslint-disable-next-line prefer-spread
    if (options.plugins) this.use.apply(this, options.plugins)

    return this
  }

  /**
   * Create a Style Sheet.
   */
  createStyleSheet(styles: Object, options: StyleSheetFactoryOptions = {}): StyleSheet {
    let {index} = options
    if (typeof index !== 'number') {
      index = sheets.index === 0 ? 0 : sheets.index + 1
    }
    const sheet = new StyleSheet(styles, {
      ...options,
      jss: this,
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
  createRule(name?: string, style?: JssStyle = {}, options?: RuleFactoryOptions = {}): Rule | null {
    // Enable rule without name for inline styles.
    if (typeof name === 'object') {
      return this.createRule(undefined, name, style)
    }

    const ruleOptions: RuleOptions = {...options, jss: this, Renderer: this.options.Renderer}

    if (!ruleOptions.generateClassName) ruleOptions.generateClassName = this.generateClassName
    if (!ruleOptions.classes) ruleOptions.classes = {}
    const rule = createRule(name, style, ruleOptions)

    if (!rule) return null

    if (!ruleOptions.selector && rule instanceof StyleRule) {
      rule.selector = `.${ruleOptions.generateClassName(rule)}`
    }

    if (rule instanceof KeyframesRule) {
      rule.id = ruleOptions.generateClassName(rule)
    }

    this.plugins.onProcessRule(rule)

    return rule
  }

  /**
   * Register plugin. Passed function will be invoked with a rule instance.
   */
  use(...plugins: Array<Plugin>): this {
    plugins.forEach(plugin => {
      // Avoids applying same plugin twice, at least based on ref.
      if (this.options.plugins.indexOf(plugin) === -1) {
        this.options.plugins.push(plugin)
        this.plugins.use(plugin)
      }
    })

    return this
  }
}
