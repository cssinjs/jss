/* @flow */

import type {toCssOptions, StyleSheet} from './types'

/**
 * Sheets registry to access them all at one place.
 */
export default class SheetsRegistry {
  registry: Array<StyleSheet> = []

  /**
   * Register a style sheet.
   */
  add(sheet: StyleSheet): void {
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
   * Reset the registry.
   */
  reset(): void {
    this.registry = []
  }

  /**
   * Remove a style sheet.
   */
  remove(sheet: StyleSheet): void {
    const index = this.registry.indexOf(sheet)
    this.registry.splice(index, 1)
  }

  /**
   * Convert all attached sheets to a CSS string.
   */
  toString(options?: toCssOptions): string {
    return this.registry
      .filter(sheet => sheet.attached)
      .map(sheet => sheet.toString(options))
      .join('\n')
  }
}
