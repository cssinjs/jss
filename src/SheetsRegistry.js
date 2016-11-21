/**
 * Sheets registry to access them all at one place.
 *
 * @api public
 */
export default class SheetsRegistry {
  registry = []

  /**
   * Register a style sheet.
   *
   * @param {StyleSheet} sheet
   * @api public
   */
  add(sheet) {
    const {registry} = this
    const {index} = sheet.options

    if (!registry.length || index >= registry[registry.length - 1].options.index) {
      registry.push(sheet)
      return
    }

    for (let i = 0; i < registry.length; i++) {
      const {options} = registry[i]
      if (options.index > index) {
        registry.splice(i, 0, sheet)
        return
      }
    }
  }

  /**
   * Remove a style sheet.
   *
   * @param {StyleSheet} sheet
   * @api public
   */
  remove(sheet) {
    const index = this.registry.indexOf(sheet)
    this.registry.splice(index, 1)
  }

  /**
   * Returns CSS string with all Style Sheets.
   *
   * @param {StyleSheet} sheet
   * @api public
   */
  toString(options) {
    return this.registry
      .map(sheet => sheet.toString(options))
      .join('\n')
  }
}
