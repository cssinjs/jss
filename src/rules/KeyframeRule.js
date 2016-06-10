/**
 * Keyframe rule.
 *
 * @api private
 */
export default class KeyframeRule {
  constructor(selector, frames, options) {
    this.type = 'keyframe'
    this.selector = selector
    this.options = options
    this.frames = this.formatFrames(frames)
  }

  /**
   * Creates formatted frames where every frame value is a rule instance.
   *
   * @api private
   */
  formatFrames(frames) {
    const newFrames = Object.create(null)
    for (const name in frames) {
      const options = {...this.options, named: false, parent: this}
      newFrames[name] = this.options.jss.createRule(name, frames[name], options)
    }
    return newFrames
  }

  /**
   * Generates a CSS string.
   *
   * @return {String}
   * @api private
   */
  toString() {
    let str = `${this.selector} {\n`
    const options = {indentationLevel: 1}
    for (const name in this.frames) {
      str += `${this.frames[name].toString(options)}\n`
    }
    str += '}'
    return str
  }
}
