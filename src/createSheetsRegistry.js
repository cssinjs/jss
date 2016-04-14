/**
 * Style sheets registry.
 */
export default function createSheetsRegistry() {
  const registry = []

  /**
   * Register a style sheet.
   *
   * @param {Object} sheet
   */
  function add(sheet) {
    registry.push(sheet)
  }

  /**
   * Returns CSS string with all Style Sheets.
   *
   * @param {StyleSheet} sheet
   * @return {String}
   */
  function toString(options) {
    return registry
      .map(sheet => sheet.toString(options))
      .join('\n')
  }

  return {registry, add, toString}
}
