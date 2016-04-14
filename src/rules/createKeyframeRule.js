import createBaseRule from './createBaseRule'

/**
 * Creates formatted frames where every frame value is a rule instance.
 */
function formatFrames(frames, rule) {
  const newFrames = Object.create(null)
  for (const name in frames) {
    const options = {...rule.options, named: false, parent: rule}
    newFrames[name] = rule.options.jss.createRule(name, frames[name], options)
  }
  return newFrames
}

/**
 * Create rules like @charset, @import, @namespace.
 *
 * @param {String} selector
 * @param {String} value
 * @param {Object} options
 * @return {Object}
 */
export default function createKeyframeRule(selector, frames, options) {
  const rule = createBaseRule('keyframe', {selector, options})

  frames = formatFrames(frames, rule)

  /**
   * Generates a CSS string.
   *
   * @return {String}
   */
  rule.toString = () => {
    let str = `${selector} {\n`
    const options = {indentationLevel: 1}
    for (const name in frames) {
      str += `${frames[name].toString(options)}\n`
    }
    str += `}`
    return str
  }

  return rule
}
