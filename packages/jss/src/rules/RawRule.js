/* @flow */
import type {CSSStyleRule, RuleOptions, ToCssOptions, BaseRule} from '../types'

export default class RawRule implements BaseRule {
  type = 'raw'

  key: string

  value: string

  options: RuleOptions

  isProcessed: boolean = false

  renderable: ?CSSStyleRule

  constructor(key: string, value: string, options: RuleOptions) {
    this.key = key
    this.value = value
    this.options = options
  }

  /**
   * Generates a CSS string.
   */
  // eslint-disable-next-line no-unused-vars
  toString(options?: ToCssOptions): string {
    return this.value
  }
}
