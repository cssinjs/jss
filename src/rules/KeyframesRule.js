/* @flow */
import RuleList from '../RuleList'
import type {CSSStyleRule, RuleOptions, ToCssOptions, BaseRule} from '../types'

/**
 * Rule for @keyframes
 */
export default class KeyframesRule implements BaseRule {
  type = 'keyframes'

  key: string

  rules: RuleList

  options: RuleOptions

  isProcessed: boolean = false

  renderable: ?CSSStyleRule

  constructor(key: string, frames: Object, options: RuleOptions) {
    this.key = key
    this.options = options
    this.rules = new RuleList({...options, parent: this})

    for (const name in frames) {
      this.rules.add(name, frames[name], {
        ...this.options,
        parent: this,
        selector: name
      })
    }

    this.rules.process()
  }

  /**
   * Generates a CSS string.
   */
  toString(options?: ToCssOptions = {indent: 1}): string {
    let inner = this.rules.toString(options)
    if (inner) inner += '\n'
    return `${this.key} {\n${inner}}`
  }
}
