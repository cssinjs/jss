import toCss from '../utils/toCss'
import {BaseStyleRule} from './styleRule'

export class KeyframeRule extends BaseStyleRule {
  /**
   * Generates a CSS string.
   */
  toString(options) {
    const {sheet} = this.options
    const link = sheet ? sheet.options.link : false
    const opts = link ? {...options, allowEmpty: true} : options
    return toCss(this.key, this.style, opts)
  }
}

export default {
  onCreateRule(key, style, options) {
    if (options.parent && options.parent.type === 'keyframes') {
      return new KeyframeRule(key, style, options)
    }
    return null
  }
}
