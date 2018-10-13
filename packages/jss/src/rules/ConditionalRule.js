/* @flow */
import RuleList from '../RuleList'
import type {CSSMediaRule, Rule, RuleOptions, ToCssOptions, JssStyle, ContainerRule} from '../types'

const defaultToStringOptions = {
  indent: 1,
  children: true
}

/**
 * Conditional rule for @media, @supports
 */
export default class ConditionalRule implements ContainerRule {
  type = 'conditional'

  key: string

  rules: RuleList

  options: RuleOptions

  isProcessed: boolean = false

  renderable: ?CSSMediaRule

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
  toString(options?: ToCssOptions = defaultToStringOptions): string {
    if (options.children === false) {
      return `${this.key} {}`
    }
    const children = this.rules.toString(options)
    return children ? `${this.key} {\n${children}\n}` : ''
  }
}
