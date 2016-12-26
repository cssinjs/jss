/* @flow */
import type {RuleOptions} from '../types'

type Name = 'charset'|'import'|'namespace'

export default class SimpleRule {
  type = 'simple'

  name: Name

  value: string

  options: RuleOptions

  isProcessed: ?boolean

  constructor(name: Name, value: string, options: RuleOptions) {
    this.name = name
    this.value = value
    this.options = options
  }

  /**
   * Generates a CSS string.
   */
  toString(): string {
    if (Array.isArray(this.value)) {
      let str = ''
      for (let index = 0; index < this.value.length; index++) {
        str += `${this.name} ${this.value[index]};`
        if (this.value[index + 1]) str += '\n'
      }
      return str
    }

    return `${this.name} ${this.value};`
  }
}
