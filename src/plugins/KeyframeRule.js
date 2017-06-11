/* @flow */
import RulesContainer from '../RulesContainer'
import type {RuleOptions, ToCssOptions, BaseRule} from '../types'

/**
 * Rule for @keyframes
 */
export default class KeyframeRule implements BaseRule {
  type = 'keyframe'

  key: string

  rules: RulesContainer

  options: RuleOptions

  isProcessed: boolean = false

  renderable: ?CSSStyleRule

  constructor(key: string, frames: Object, options: RuleOptions) {
    this.key = key
    this.options = options
    this.rules = new RulesContainer({...options, parent: this})

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
