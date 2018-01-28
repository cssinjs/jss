/* @flow */
import type {ToCssOptions} from './types'
import type StyleSheet from './StyleSheet'

/**
 * Sheets registry to access them all at one place.
 */
export default class SheetsRegistry {
  registry: Array<StyleSheet> = []

  /**
   * Current highest index number.
   */
  get index(): number {
    return this.registry.length === 0
      ? 0
      : this.registry[this.registry.length - 1].options.index
  }

  /**
   * Register a Style Sheet.
   */
  add(sheet: StyleSheet): void {
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
  reset(): void {
    this.registry = []
  }

  /**
   * Remove a Style Sheet.
   */
  remove(sheet: StyleSheet): void {
    const index = this.registry.indexOf(sheet)
    this.registry.splice(index, 1)
  }

  /**
   * Convert all attached sheets to a CSS string.
   */
  toString(options?: ToCssOptions): string {
    return this.registry
      .filter(sheet => sheet.attached)
      .map(sheet => sheet.toString(options))
      .join('\n')
  }
}
