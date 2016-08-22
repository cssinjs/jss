/**
 * Sheets registry to access them all at one place.
 *
 * @api public
 */
export default class SheetsRegistry {
  constructor() {
    this.registry = []
  }

  /**
   * Register a style sheet.
   *
   * @param {StyleSheet} sheet
   * @api public
   */
  add(sheet) {
    this.registry.push(sheet)
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
