/* @flow */
import RulesContainer from '../RulesContainer'
import type {Rule, RuleOptions} from '../types'

/**
 * Conditional rule for @media, @supports
 */
export default class ConditionalRule {
  type = 'conditional'

  selector: string

  rules: RulesContainer

  options: RuleOptions

  constructor(selector: string, styles: Object, options: RuleOptions) {
    this.selector = selector
    this.options = options
    this.rules = new RulesContainer({...options, parent: this})
    for (const name in styles) {
      this.createAndRegisterRule(name, styles[name])
    }

    if (options.jss) {
      const {plugins} = options.jss
      this.rules.getIndex().forEach(plugins.onProcessRule, plugins)
    }
  }

  /**
   * Get a rule.
   */
  getRule(name: string): Rule {
    return this.rules.get(name)
  }

  /**
   * Get index of a rule.
   */
  indexOf(rule: Rule): number {
    return this.rules.indexOf(rule)
  }

  /**
   * Create and register rule, run plugins.
   *
   * Will not render after Style Sheet was rendered the first time.
   * Will link the rule in `this.rules`.
   */
  addRule(name: string, style: Object, options: RuleOptions): Rule {
    return this.rules.create(name, style, this.getChildOptions(options))
  }

  /**
   * Build options object for a child rule.
   */
  getChildOptions(options?: RuleOptions): RuleOptions {
    return {...this.options, parent: this, ...options}
  }

  /**
   * Create and register a rule.
   */
  createAndRegisterRule(name?: string, style: Object): Rule {
    return this.rules.createAndRegister(name, style, this.getChildOptions())
  }

  /**
   * Generates a CSS string.
   */
  toString(): string {
    const inner = this.rules.toString({indent: 1})
    if (!inner) return ''
    return `${this.selector} {\n${inner}\n}`
  }
}
