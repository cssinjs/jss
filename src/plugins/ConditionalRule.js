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

  options: Object

  isProcessed: ?boolean

  constructor(selector: string, styles: Object, options: RuleOptions) {
    this.selector = selector
    this.options = options
    this.rules = new RulesContainer({...options, parent: this})

    for (const name in styles) {
      this.rules.add(name, styles[name])
    }

    this.rules.process()
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
   */
  addRule(name: string, style: Object, options?: RuleOptions): Rule {
    const rule = this.rules.add(name, style, options)
    this.options.jss.plugins.onProcessRule(rule)
    return rule
  }

  /**
   * Generates a CSS string.
   */
  toString(): string {
    const inner = this.rules.toString({indent: 1})
    return inner ? `${this.selector} {\n${inner}\n}` : ''
  }
}
