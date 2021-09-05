import toCss from '../utils/toCss'

export class ViewportRule {
  type = 'viewport'

  at = '@viewport'

  isProcessed = false

  constructor(key, style, options) {
    this.key = key
    this.style = style
    this.options = options
  }

  /**
   * Generates a CSS string.
   */
  toString(options) {
    return toCss(this.key, this.style, options)
  }
}

export default {
  onCreateRule(key, style, options) {
    return key === '@viewport' || key === '@-ms-viewport'
      ? new ViewportRule(key, style, options)
      : null
  }
}
