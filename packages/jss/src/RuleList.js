/* @flow */
import createRule from './utils/createRule'
import StyleRule from './rules/StyleRule'
import type {
  RuleListOptions,
  ToCssOptions,
  Rule,
  RuleOptions,
  UpdateArguments,
  JssStyle,
  Classes
} from './types'
import escape from './utils/escape'

const defaultUpdateOptions = {
  process: true
}

/**
 * Contains rules objects and allows adding/removing etc.
 * Is used for e.g. by `StyleSheet` or `ConditionalRule`.
 */
export default class RuleList {
  // Rules registry for access by .get() method.
  // It contains the same rule registered by name and by selector.
  map: {[key: string]: Rule} = {}

  // Original styles object.
  raw: {[key: string]: JssStyle} = {}

  // Used to ensure correct rules order.
  index: Array<Rule> = []

  options: RuleListOptions

  classes: Classes

  constructor(options: RuleListOptions) {
    this.options = options
    this.classes = options.classes
  }

  /**
   * Create and register rule.
   *
   * Will not render after Style Sheet was rendered the first time.
   */
  add(key: string, decl: JssStyle, options?: RuleOptions): Rule {
    const {parent, sheet, jss, Renderer, generateClassName} = this.options

    options = {
      classes: this.classes,
      parent,
      sheet,
      jss,
      Renderer,
      generateClassName,
      ...options
    }

    if (!options.selector && this.classes[key]) {
      options.selector = `.${escape(this.classes[key])}`
    }

    this.raw[key] = decl

    const rule = createRule(key, decl, options)

    let className

    if (!options.selector && rule instanceof StyleRule) {
      className = generateClassName(rule, sheet)
      rule.selector = `.${escape(className)}`
    }

    this.register(rule, className)

    const index = options.index === undefined ? this.index.length : options.index
    this.index.splice(index, 0, rule)

    return rule
  }

  /**
   * Get a rule.
   */
  get(name: string): Rule {
    return this.map[name]
  }

  /**
   * Delete a rule.
   */
  remove(rule: Rule): void {
    this.unregister(rule)
    delete this.raw[rule.key]
    this.index.splice(this.indexOf(rule), 1)
  }

  /**
   * Get index of a rule.
   */
  indexOf(rule: Rule): number {
    return this.index.indexOf(rule)
  }

  /**
   * Run `onProcessRule()` plugins on every rule.
   */
  process(): void {
    const {plugins} = this.options.jss
    // We need to clone array because if we modify the index somewhere else during a loop
    // we end up with very hard-to-track-down side effects.
    this.index.slice(0).forEach(plugins.onProcessRule, plugins)
  }

  /**
   * Register a rule in `.map` and `.classes` maps.
   */
  register(rule: Rule, className?: string): void {
    this.map[rule.key] = rule
    if (rule instanceof StyleRule) {
      this.map[rule.selector] = rule
      if (className) this.classes[rule.key] = className
    }
  }

  /**
   * Unregister a rule.
   */
  unregister(rule: Rule): void {
    delete this.map[rule.key]
    if (rule instanceof StyleRule) {
      delete this.map[rule.selector]
      delete this.classes[rule.key]
    }
  }

  /**
   * Update the function values with a new data.
   */
  update(...args: UpdateArguments): void {
    const {
      jss: {plugins},
      sheet
    } = this.options

    let name
    let data
    let options

    if (typeof args[0] === 'string') {
      name = args[0]
      // $FlowFixMe
      data = args[1]
      // $FlowFixMe
      options = args[2]
    } else {
      data = args[0]
      // $FlowFixMe
      options = args[1]
      name = null
    }

    if (!options) options = defaultUpdateOptions

    if (name) {
      plugins.onUpdate(data, this.get(name), sheet, options)
    } else {
      for (let index = 0; index < this.index.length; index++) {
        plugins.onUpdate(data, this.index[index], sheet, options)
      }
    }
  }

  /**
   * Convert rules to a CSS string.
   */
  toString(options?: ToCssOptions): string {
    let str = ''
    const {sheet} = this.options
    const link = sheet ? sheet.options.link : false

    for (let index = 0; index < this.index.length; index++) {
      const rule = this.index[index]
      const css = rule.toString(options)

      // No need to render an empty rule.
      if (!css && !link) continue

      if (str) str += '\n'
      str += css
    }

    return str
  }
}
