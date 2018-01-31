/* @flow */
import type {RuleOptions, ToCssOptions, BaseRule} from '../types'

export default class SimpleRule implements BaseRule {
  type = 'simple'

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
    if (Array.isArray(this.value)) {
      let str = ''
      for (let index = 0; index < this.value.length; index++) {
        str += `${this.key} ${this.value[index]};`
        if (this.value[index + 1]) str += '\n'
      }
      return str
    }

    return `${this.key} ${this.value};`
  }
}
