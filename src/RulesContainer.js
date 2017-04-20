/* @flow */
import createRule from './utils/createRule'
import createRuleUpdater from './utils/createRuleUpdater'
import type {
  RulesContainerOptions,
  ToCssOptions,
  Rule,
  RuleOptions,
  JssStyle
} from './types'

/**
 * Contains rules objects and allows adding/removing etc.
 * Is used for e.g. by `StyleSheet` or `ConditionalRule`.
 */
export default class RulesContainer {
  // Rules registry for access by .get() method.
  // It contains the same rule registered by name and by selector.
  map: {[key: string]: Rule} = Object.create(null)

  // Original styles object.
  raw: {[key: string]: JssStyle} = Object.create(null)

  // Used to ensure correct rules order.
  index: Array<Rule> = []

  options: RulesContainerOptions

  classes: Object

  RuleUpdater: Function

  constructor(options: RulesContainerOptions) {
    this.options = options
    this.classes = options.classes

    this.RuleUpdater = createRuleUpdater(RulesContainer)
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

    if (!options.className) options.className = this.classes[name]

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
    if (rule.name) this.map[rule.name] = rule
    if (rule.className && rule.name) this.classes[rule.name] = rule.className
    if (rule.selector) this.map[rule.selector] = rule
  }

  /**
   * Unregister a rule.
   */
  unregister(rule: Rule): void {
    if (rule.name) {
      delete this.map[rule.name]
      delete this.classes[rule.name]
    }
    delete this.map[rule.selector]
  }

  /**
   * Update the function values with a new data for all rules.
   */
  update(data: Object): void {
    this.index.forEach(this.RuleUpdater({
      data,
      processor: 'update',
      args: data,
    }))
  }

  /**
   * Update the function values with a new data for rule by its name.
   */
  updateRuleByName(name: string, data: Object): void {
    const rule = this.map[name]

    this.RuleUpdater({
      data,
      processor: 'updateRuleByName',
      args: [name, data],
    })(rule)
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
