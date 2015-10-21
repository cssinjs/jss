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
    let newFrames = {}
    for (let name in frames) {
      let options = {...this.options, named: false, parent: this}
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
    let options = {indentationLevel: 1}
    for (let name in this.frames) {
      str += `${this.frames[name].toString(options)}\n`
    }
    str += `}`
    return str
  }
}
