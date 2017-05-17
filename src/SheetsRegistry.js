/* @flow */
import {createGenerateClassName} from './utils/generateClassName'
import type {ToCssOptions, SheetsRegistryContext} from './types'
import type StyleSheet from './StyleSheet'

/**
 * Sheets registry to access them all at one place.
 */
export default class SheetsRegistry {
  registry: Array<StyleSheet> = []
  context: SheetsRegistryContext

  constructor() {
    this.context = {
      generateClassName: createGenerateClassName()
    }
  }

  /**
   * Register a Style Sheet.
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

  /**
   * Get the class name generator, if there
   * is one.
   */
  getContext(): SheetsRegistryContext {
    return this.context
  }
}
