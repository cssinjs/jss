/* @flow */
import RuleList from '../RuleList'
import type {Rule, RuleOptions, ToCssOptions, JssStyle, BaseRule} from '../types'

/**
 * Conditional rule for @media, @supports
 */
export default class ConditionalRule implements BaseRule {
  type = 'conditional'

  key: string

  rules: RuleList

  options: RuleOptions

  isProcessed: boolean = false

  renderable: ?CSSStyleRule

  constructor(key: string, styles: Object, options: RuleOptions) {
    this.key = key
    this.options = options
    this.rules = new RuleList({...options, parent: this})

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
  addRule(name: string, style: JssStyle, options?: RuleOptions): Rule {
    const rule = this.rules.add(name, style, options)
    this.options.jss.plugins.onProcessRule(rule)
    return rule
  }

  /**
   * Generates a CSS string.
   */
  toString(options?: ToCssOptions = {indent: 1}): string {
    const inner = this.rules.toString(options)
    return inner ? `${this.key} {\n${inner}\n}` : ''
  }
}
