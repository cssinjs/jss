/* @flow */
import createRule from '../utils/createRule'
import type {RuleOptions} from '../types'

const toCssOptions = {indent: 1}

export default class KeyframeRule {
  type = 'keyframe'

  selector: string

  frames: Object

  options: RuleOptions

  isProcessed: ?boolean

  constructor(selector: string, frames: Object, options: RuleOptions) {
    this.selector = selector
    this.options = options
    this.frames = this.formatFrames(frames)
  }

  /**
   * Creates formatted frames where every frame value is a rule instance.
   */
  formatFrames(frames: Object): Object {
    const newFrames = Object.create(null)
    for (const name in frames) {
      const options = {
        ...this.options,
        parent: this,
        className: name,
        selector: name
      }
      const rule = createRule(name, frames[name], options)
      options.jss.plugins.onProcessRule(rule)
      newFrames[name] = rule
    }
    return newFrames
  }

  /**
   * Generates a CSS string.
   */
  toString(): string {
    let str = `${this.selector} {\n`
    for (const name in this.frames) {
      str += `${this.frames[name].toString(toCssOptions)}\n`
    }
    str += '}'
    return str
  }
}
