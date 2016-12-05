/* @-flow */
import toCss from '../utils/toCss'
import toCssValue from '../utils/toCssValue'
import findClassNames from '../utils/findClassNames'
import type {ToCssOptions, InstanceRuleOptions} from '../types'

const {parse, stringify} = JSON

export default class RegularRule {
  type = 'regular'

  name: string

  style: Object

  originalStyle: Object

  className: string

  selectorText: string

  renderer: Renderer

  renderable: Node

  options: InstanceRuleOptions

  constructor(name?: string, style: Object, options: InstanceRuleOptions) {
    // We expect style to be plain object.
    // To avoid original style object mutations, we clone it and hash it
    // along the way.
    // It is also the fastetst way.
    // http://jsperf.com/lodash-deepclone-vs-jquery-extend-deep/6
    const styleStr = stringify(style)
    this.style = parse(styleStr)
    this.name = name
    this.options = options
    this.originalStyle = style
    this.className = options.className || options.generateClassName(styleStr, this)
    this.selectorText = options.selector || `.${this.className}`
    this.renderer = options.sheet ? options.sheet.renderer : new options.Renderer()
  }

  /**
   * Set selector string.
   * Attenition: use this with caution. Most browser didn't implement selector
   * text setter, so this will result in rerendering of entire style sheet.
   */
  set selector(selector: string): void {
    const {sheet} = this.options

    // After we modify selector, ref by old selector needs to be removed.
    if (sheet) sheet.rules.unregister(this)

    this.selectorText = selector
    this.className = findClassNames(selector)

    if (!this.renderable) {
      // Register the rule with new selector.
      if (sheet) sheet.rules.register(this)
      return
    }

    const changed = this.renderer.selector(this.renderable, selector)

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
      return this.renderer.selector(this.renderable)
    }

    return this.selectorText
  }

  /**
   * Get or set a style property.
   */
  prop(name: string, value?: string | number): RegularRule | string | number {
    // Its a setter.
    if (value != null) {
      this.style[name] = value
      // Only defined if option linked is true.
      if (this.renderable) this.renderer.style(this.renderable, name, value)
      return this
    }
    // Its a getter, read the value from the DOM if its not cached.
    if (this.renderable && this.style[name] == null) {
      // Cache the value after we have got it from the DOM once.
      this.style[name] = this.renderer.style(this.renderable, name)
    }
    return this.style[name]
  }

  /**
   * Apply rule to an element inline.
   */
  applyTo(renderable: Node): RegularRule {
    const json = this.toJSON()
    for (const prop in json) this.renderer.style(renderable, prop, json[prop])
    return this
  }

  /**
   * Returns JSON representation of the rule.
   * Fallbacks are not supported.
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
