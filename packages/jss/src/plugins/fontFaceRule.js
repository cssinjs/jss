import toCss from '../utils/toCss'
import getWhitespaceSymbols from '../utils/getWhitespaceSymbols'

export class FontFaceRule {
  type = 'font-face'

  at = '@font-face'

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
    const {linebreak} = getWhitespaceSymbols(options)
    if (Array.isArray(this.style)) {
      let str = ''
      for (let index = 0; index < this.style.length; index++) {
        str += toCss(this.at, this.style[index])
        if (this.style[index + 1]) str += linebreak
      }
      return str
    }

    return toCss(this.at, this.style, options)
  }
}

const keyRegExp = /@font-face/

export default {
  onCreateRule(key, style, options) {
    return keyRegExp.test(key) ? new FontFaceRule(key, style, options) : null
  }
}
