/* @flow */
import RuleList from '../RuleList'
import type {CSSKeyframesRule, Rule, RuleOptions, ToCssOptions, ContainerRule} from '../types'

const defaultToStringOptions = {
  indent: 1,
  children: true
}
/**
 * Rule for @keyframes
 */
export default class KeyframesRule implements ContainerRule {
  type = 'keyframes'

  key: string

  name: string

  id: string

  rules: RuleList

  options: RuleOptions

  isProcessed: boolean = false

  renderable: ?CSSKeyframesRule

  constructor(key: string, frames: Object, options: RuleOptions) {
    this.key = key
    // TODO make it more robust
    this.name = key.substr(this.type.length + 2)
    const fakeRule: Rule = ({key: this.name}: any)
    this.id = options.jss.generateClassName(fakeRule, options.sheet)
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
  toString(options?: ToCssOptions = defaultToStringOptions): string {
    if (options.children === false) {
      return `@keyframes ${this.id} {}`
    }
    let children = this.rules.toString(options)
    if (children) children = `\n${children}\n`
    return `@keyframes ${this.id} {${children}}`
  }
}
