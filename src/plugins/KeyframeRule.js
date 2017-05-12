/* @flow */
import RulesContainer from '../RulesContainer'
import type {RuleOptions} from '../types'

/**
 * Rule for @keyframes
 */
export default class KeyframeRule {
  type = 'keyframe'

  selector: string

  rules: RulesContainer

  options: Object

  isProcessed: ?boolean

  constructor(selector: string, frames: Object, options: RuleOptions) {
    this.selector = selector
    this.options = options
    this.rules = new RulesContainer({...options, parent: this})

    for (const name in frames) {
      this.rules.add(name, frames[name], {
        ...this.options,
        parent: this,
        className: name,
        selector: name
      })
    }

    this.rules.process()
  }

  /**
   * Generates a CSS string.
   */
  toString(): string {
    let inner = this.rules.toString({indent: 1})
    if (inner) inner += '\n'
    return `${this.selector} {\n${inner}}`
  }
}
