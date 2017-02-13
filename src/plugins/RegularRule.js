/* @flow */
import toCss from '../utils/toCss'
import toCssValue from '../utils/toCssValue'
import findClassNames from '../utils/findClassNames'
import type {ToCssOptions, RuleOptions, Renderer as RendererInterface} from '../types'

const {parse, stringify} = JSON

export default class RegularRule {
  type = 'regular'

  name: ?string

  isProcessed: ?boolean

  style: Object

  originalStyle: Object

  className: string

  selectorText: string

  renderer: RendererInterface

  renderable: ?CSSStyleRule

  options: RuleOptions

  /**
   * We expect `style` to be a plain object.
   * To avoid original style object mutations, we clone it and hash it
   * along the way.
   * It is also the fastetst way.
   * http://jsperf.com/lodash-deepclone-vs-jquery-extend-deep/6
   */
  constructor(name?: string, style: Object, options: RuleOptions) {
    const {generateClassName, sheet, Renderer} = options
    const styleStr = stringify(style)
    this.style = parse(styleStr)
    this.name = name
    this.options = options
    this.originalStyle = style
    this.className = ''
    if (options.className) this.className = options.className
    else if (generateClassName) this.className = generateClassName(styleStr, this, options.sheet)
    this.selectorText = options.selector || `.${this.className}`
    if (sheet) this.renderer = sheet.renderer
    else if (Renderer) this.renderer = new Renderer()
  }

  /**
   * Set selector string.
   * Attenition: use this with caution. Most browser didn't implement
   * selectorText setter, so this may result in rerendering of entire Style Sheet.
   */
  set selector(selector: string): void {
    const {sheet} = this.options

    // After we modify a selector, ref by old selector needs to be removed.
    if (sheet) sheet.rules.unregister(this)

    this.selectorText = selector
    this.className = findClassNames(selector)

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
  prop(name: string, value?: string): RegularRule|string {
    // Its a setter.
    if (value != null) {
      // Don't do anything if the value has not changed.
      if (this.style[name] !== value) {
        this.style[name] = value
        // Only defined if option linked is true.
        if (this.renderable) this.renderer.setStyle(this.renderable, name, value)
      }
      return this
    }
    // Its a getter, read the value from the DOM if its not cached.
    if (this.renderable && this.style[name] == null) {
      // Cache the value after we have got it from the DOM once.
      this.style[name] = this.renderer.getStyle(this.renderable, name)
    }
    return this.style[name]
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
   * Useful as inline style.
   */
  toJSON(): Object {
    const json = Object.create(null)
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
    return toCss(this.selector, this.style, options)
  }
}
