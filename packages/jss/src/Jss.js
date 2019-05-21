/* @flow */
import isInBrowser from 'is-in-browser'
import StyleSheet from './StyleSheet'
import PluginsRegistry from './PluginsRegistry'
import sheets from './sheets'
import {plugins as internalPlugins} from './plugins/index'
import createGenerateIdDefault from './utils/createGenerateId'
import createRule from './utils/createRule'
import DomRenderer from './DomRenderer'
import type {
  Rule,
  RuleFactoryOptions,
  RuleOptions,
  StyleSheetFactoryOptions,
  Plugin,
  JssOptions,
  InternalJssOptions,
  JssStyle
} from './types'
import type {GenerateId} from './utils/createGenerateId'

let instanceCounter = 0

export default class Jss {
  id = instanceCounter++

  version = process.env.VERSION

  plugins = new PluginsRegistry()

  options: InternalJssOptions = {
    id: {minify: false},
    createGenerateId: createGenerateIdDefault,
    Renderer: isInBrowser ? DomRenderer : null,
    plugins: []
  }

  generateId: GenerateId = createGenerateIdDefault({minify: false})

  constructor(options?: JssOptions) {
    for (let i = 0; i < internalPlugins.length; i++) {
      this.plugins.use(internalPlugins[i], {queue: 'internal'})
    }
    this.setup(options)
  }

  /**
   * Prepares various options, applies plugins.
   * Should not be used twice on the same instance, because there is no plugins
   * deduplication logic.
   */
  setup(options?: JssOptions = {}): this {
    if (options.createGenerateId) {
      this.options.createGenerateId = options.createGenerateId
    }

    if (options.id) {
      this.options.id = {
        ...this.options.id,
        ...options.id
      }
    }

    if (options.createGenerateId || options.id) {
      this.generateId = this.options.createGenerateId(this.options.id)
    }

    if (options.insertionPoint != null) this.options.insertionPoint = options.insertionPoint
    if ('Renderer' in options) {
      this.options.Renderer = options.Renderer
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
      generateId: options.generateId || this.generateId,
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

    if (!ruleOptions.generateId) ruleOptions.generateId = this.generateId
    if (!ruleOptions.classes) ruleOptions.classes = {}
    if (!ruleOptions.keyframes) ruleOptions.keyframes = {}

    const rule = createRule(name, style, ruleOptions)

    if (rule) this.plugins.onProcessRule(rule)

    return rule
  }

  /**
   * Register plugin. Passed function will be invoked with a rule instance.
   */
  use(...plugins: Array<Plugin>): this {
    plugins.forEach(plugin => {
      this.plugins.use(plugin)
    })

    return this
  }
}
