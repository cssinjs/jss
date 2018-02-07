/* @flow */
import warning from 'warning'
import toCss from '../utils/toCss'
import toCssValue from '../utils/toCssValue'
import type {
  ToCssOptions,
  RuleOptions,
  Renderer as RendererInterface,
  JssStyle,
  JssValue,
  BaseRule
} from '../types'

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
    const {sheet, Renderer, selector} = options
    this.key = key
    this.options = options
    this.style = style
    if (selector) this.selectorText = selector
    this.renderer = sheet ? sheet.renderer : new Renderer()
  }

  /**
   * Set selector string.
   * Attention: use this with caution. Most browsers didn't implement
   * selectorText setter, so this may result in rerendering of entire Style Sheet.
   */
  set selector(selector: string): void {
    if (selector === this.selectorText) return

    this.selectorText = selector

    if (!this.renderable) return

    const hasChanged = this.renderer.setSelector(this.renderable, selector)

    // If selector setter is not implemented, rerender the rule.
    if (!hasChanged && this.renderable) {
      const renderable = this.renderer.replaceRule(this.renderable, this)
      if (renderable) this.renderable = renderable
    }
  }

  /**
   * Get selector string.
   */
  get selector(): string {
    return this.selectorText
  }

  /**
   * Get or set a style property.
   */
  prop(name: string, value?: JssValue): StyleRule | string {
    // It's a getter.
    if (value === undefined) return this.style[name]

    // Don't do anything if the value has not changed.
    if (this.style[name] === value) return this

    value = this.options.jss.plugins.onChangeValue(value, name, this)

    const isEmpty = value == null || value === false
    const isDefined = name in this.style

    // Value is empty and wasn't defined before.
    if (isEmpty && !isDefined) return this

    // We are going to remove this value.
    const remove = isEmpty && isDefined

    if (remove) delete this.style[name]
    else this.style[name] = value

    // Renderable is defined if StyleSheet option `link` is true.
    if (this.renderable) {
      if (remove) this.renderer.removeProperty(this.renderable, name)
      else this.renderer.setProperty(this.renderable, name, value)
      return this
    }

    const {sheet} = this.options
    if (sheet && sheet.attached) {
      warning(false, 'Rule is not linked. Missing sheet option "link: true".')
    }
    return this
  }

  /**
   * Apply rule to an element inline.
   */
  applyTo(renderable: HTMLElement): this {
    const json = this.toJSON()
    for (const prop in json) this.renderer.setProperty(renderable, prop, json[prop])
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
      if (typeof value !== 'object') json[prop] = value
      else if (Array.isArray(value)) json[prop] = toCssValue(value)
    }
    return json
  }

  /**
   * Generates a CSS string.
   */
  toString(options?: ToCssOptions): string {
    const {sheet} = this.options
    const link = sheet ? sheet.options.link : false
    const opts = link ? {...options, allowEmpty: true} : options
    return toCss(this.selector, this.style, opts)
  }
}
