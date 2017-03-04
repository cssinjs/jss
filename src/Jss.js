/* @flow */
import warning from 'warning'
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
  JssOptions,
  RehydrationData
} from './types'

declare var __VERSION__: string

export default class Jss {
  version = __VERSION__

  plugins = new PluginsRegistry()

  options: JssOptions

  rehydrationData: RehydrationData = []

  constructor(options?: JssOptions) {
    // eslint-disable-next-line prefer-spread
    this.use.apply(this, internalPlugins)
    this.setup(options)
  }

  setup(options?: JssOptions = {}): this {
    this.options = {
      generateClassName: options.generateClassName || generateClassNameDefault,
      insertionPoint: options.insertionPoint || 'jss',
      ...options
    }
    // eslint-disable-next-line prefer-spread
    if (options.plugins) this.use.apply(this, options.plugins)
    return this
  }

  /**
   * Create a Style Sheet.
   */
  createStyleSheet(styles: Object, options: StyleSheetOptions): StyleSheet {
    const ssrClassesMap = this.rehydrationData.length ? this.rehydrationData.shift() : undefined
    const sheet = new StyleSheet(styles, {
      jss: (this: Jss),
      generateClassName: this.options.generateClassName,
      insertionPoint: this.options.insertionPoint,
      ssrClassesMap,
      ...options
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

  /**
   * Rehydrate the client after SSR.
   * TODO move DOM logic to the DomRenderer.
   */
  rehydrate(dataOrAttr?: RehydrationData|string = 'data-rehydration', nodeOrSelector?: HTMLStyleElement|string = '#jss-ssr'): this {
    if (sheets.registry.length) {
      warning(false, 'Rehydration attempt after a .createStyleSheet() call.')
      return this
    }

    let node
    if (typeof nodeOrSelector === 'string') node = document.querySelector(nodeOrSelector)
    else node = nodeOrSelector

    if (typeof dataOrAttr === 'string') {
      this.rehydrationData = JSON.parse(node.getAttribute(dataOrAttr))
    }
    else this.rehydrationData = dataOrAttr

    return this
  }
}
