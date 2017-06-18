/* @flow */
import createRule from './utils/createRule'
import updateRule from './utils/updateRule'
import linkRule from './utils/linkRule'
import StyleRule from './rules/StyleRule'
import type {
  RuleListOptions,
  ToCssOptions,
  Rule,
  RuleOptions,
  JssStyle
} from './types'

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

  classes: Object

  constructor(options: RuleListOptions) {
    this.options = options
    this.classes = options.classes
  }

  /**
   * Create and register rule.
   *
   * Will not render after Style Sheet was rendered the first time.
   */
  add(name: string, decl: JssStyle, options?: RuleOptions): Rule {
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

    if (!options.selector && this.classes[name]) options.selector = `.${this.classes[name]}`

    this.raw[name] = decl

    const rule = createRule(name, decl, options)
    this.register(rule)

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
  register(rule: Rule): void {
    this.map[rule.key] = rule
    if (rule instanceof StyleRule) {
      this.map[rule.selector] = rule
      this.classes[rule.key] = rule.selector.substr(1)
    }
  }

  /**
   * Unregister a rule.
   */
  unregister(rule: Rule): void {
    delete this.map[rule.key]
    delete this.classes[rule.key]
    if (rule instanceof StyleRule) delete this.map[rule.selector]
  }

  /**
   * Update the function values with a new data.
   */
  update(name?: string, data?: Object): void {
    if (typeof name === 'string') {
      updateRule(this.get(name), data, RuleList)
      return
    }

    for (let index = 0; index < this.index.length; index++) {
      updateRule(this.index[index], name, RuleList)
    }
  }

  /**
   * Link renderable rules with CSSRuleList.
   */
  link(cssRules: CSSRuleList): void {
    for (let i = 0; i < cssRules.length; i++) {
      const cssRule = cssRules[i]
      const rule = this.get(this.options.sheet.renderer.getSelector(cssRule))
      if (rule) linkRule(rule, cssRule)
    }
  }

  /**
   * Convert rules to a CSS string.
   */
  toString(options?: ToCssOptions): string {
    let str = ''

    for (let index = 0; index < this.index.length; index++) {
      const rule = this.index[index]
      const css = rule.toString(options)

      // No need to render an empty rule.
      if (!css) continue

      if (str) str += '\n'
      str += css
    }

    return str
  }
}
