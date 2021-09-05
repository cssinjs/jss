import getWhitespaceSymbols from './utils/getWhitespaceSymbols'
/**
 * Sheets registry to access all instances in one place.
 */
export default class SheetsRegistry {
  registry = []

  /**
   * Current highest index number.
   */
  get index() {
    return this.registry.length === 0 ? 0 : this.registry[this.registry.length - 1].options.index
  }

  /**
   * Register a Style Sheet.
   */
  add(sheet) {
    const {registry} = this
    const {index} = sheet.options

    if (registry.indexOf(sheet) !== -1) return

    if (registry.length === 0 || index >= this.index) {
      registry.push(sheet)
      return
    }

    // Find a position.
    for (let i = 0; i < registry.length; i++) {
      if (registry[i].options.index > index) {
        registry.splice(i, 0, sheet)
        return
      }
    }
  }

  /**
   * Reset the registry.
   */
  reset() {
    this.registry = []
  }

  /**
   * Remove a Style Sheet.
   */
  remove(sheet) {
    const index = this.registry.indexOf(sheet)
    this.registry.splice(index, 1)
  }

  /**
   * Convert all attached sheets to a CSS string.
   */
  toString({attached, ...options} = {}) {
    const {linebreak} = getWhitespaceSymbols(options)
    let css = ''
    for (let i = 0; i < this.registry.length; i++) {
      const sheet = this.registry[i]
      if (attached != null && sheet.attached !== attached) {
        continue
      }
      if (css) css += linebreak
      css += sheet.toString(options)
    }
    return css
  }
}
