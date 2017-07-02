/* @flow */
import toCss from '../utils/toCss'
import toCssValue from '../utils/toCssValue'
import type {ToCssOptions, RuleOptions, Renderer as RendererInterface, JssStyle, BaseRule} from '../types'

export default class StyleRule implements BaseRule {
  type = 'style'

  key: string

  isProcessed: boolean = false

  style: JssStyle

  selectorText: string

  renderer: RendererInterface

  renderable: ?CSSStyleRule

  options: RuleOptions

  constructor(key: string, style: JssStyle, options: RuleOptions) {
    const {generateClassName, sheet, Renderer, selector} = options
    this.key = key
    this.options = options
    this.style = style
    this.selectorText = selector || `.${generateClassName(this, sheet)}`
    this.renderer = sheet ? sheet.renderer : new Renderer()
  }

  /**
   * Set selector string.
   * TODO rewrite this #419
   * Attention: use this with caution. Most browsers didn't implement
   * selectorText setter, so this may result in rerendering of entire Style Sheet.
   */
  set selector(selector: string): void {
    const {sheet} = this.options

    // After we modify a selector, ref by old selector needs to be removed.
    if (sheet) sheet.rules.unregister(this)

    this.selectorText = selector

    if (!this.renderable) {
      // Register the rule with new selector.
      if (sheet) sheet.rules.register(this)
      return
    }

    const changed = this.renderer.setSelector(this.renderable, selector)

    if (changed && sheet) {
      sheet.rules.register(this)
      return
    }

    // If selector setter is not implemented, rerender the sheet.
    // We need to delete renderable from the rule, because when sheet.deploy()
    // calls rule.toString, it will get the old selector.
    delete this.renderable
    if (sheet) {
      sheet.rules.register(this)
      sheet
        .deploy()
        .link()
    }
  }

  /**
   * Get selector string.
   */
  get selector(): string {
    if (this.renderable) {
      return this.renderer.getSelector(this.renderable)
    }

    return this.selectorText
  }

  /**
   * Get or set a style property.
   */
  prop(name: string, nextValue?: string): StyleRule|string {
    const $name = typeof this.style[name] === 'function' ? `$${name}` : name
    const currValue = this.style[$name]

    // Its a setter.
    if (nextValue != null) {
      // Don't do anything if the value has not changed.
      if (currValue !== nextValue) {
        nextValue = this.options.jss.plugins.onChangeValue(nextValue, name, this)
        Object.defineProperty(this.style, $name, {
          value: nextValue,
          writable: true
        })
        // Defined if StyleSheet option `link` is true.
        if (this.renderable) this.renderer.setStyle(this.renderable, name, nextValue)
      }
      return this
    }

    // Its a getter, read the value from the DOM if its not cached.
    if (this.renderable && currValue == null) {
      // Cache the value after we have got it from the DOM first time.
      Object.defineProperty(this.style, $name, {
        value: this.renderer.getStyle(this.renderable, name),
        writable: true
      })
    }

    return this.style[$name]
  }

  /**
   * Apply rule to an element inline.
   */
  applyTo(renderable: HTMLElement): this {
    const json = this.toJSON()
    for (const prop in json) this.renderer.setStyle(renderable, prop, json[prop])
    return this
  }

  /**
   * Returns JSON representation of the rule.
   * Fallbacks are not supported.
   * Useful for inline styles.
   */
  toJSON(): Object {
    const json = {}
    for (const prop in this.style) {
      const value = this.style[prop]
      const type = typeof value
      if (type === 'function') json[prop] = this.style[`$${prop}`]
      else if (type !== 'object') json[prop] = value
      else if (Array.isArray(value)) json[prop] = toCssValue(value)
    }
    return json
  }

  /**
   * Generates a CSS string.
   */
  toString(options?: ToCssOptions): string {
    return toCss(this.selector, this.style, options)
  }
}
