import {clone, toCSS, findClassNames} from '../utils'
import createBaseRule from './createBaseRule'

/**
 * Create a regular rule.
 *
 * @param {String} selector
 * @param {Object} style
 * @param {Object} options
 * @return {Object}
 */
export default function createRegularRule(selector = '', style, options) {
  const rule = createBaseRule('regular', {
    className: '',
    originalStyle: style,
    // We expect style to be plain object.
    style: clone(style),
    options
  })

  if (options.named) {
    rule.name = selector
    rule.className = options.className || (rule.name ? `${rule.name}--${rule.id}` : rule.id)
    selector = `.${rule.className}`
  }

  /**
   * Get/set selector string.
   *
   * Attenition: use setter with caution. Most browser didn't implement selector
   * text setter, so it will result in rerendering of entire style sheet.
   *
   * @return {String}
   */
  Object.defineProperty(rule, 'selector', {
    get: () => {
      if (rule.renderable) {
        return rule.options.Renderer.getSelector(rule.renderable)
      }

      return selector
    },

    set: (newSelector = '') => {
      const {Renderer, sheet} = rule.options

      // After we modify selector, ref by old selector needs to be removed.
      if (sheet) sheet.unregisterRule(rule)

      selector = newSelector
      rule.className = findClassNames(newSelector)

      if (!rule.renderable) {
        // Register the rule with new selector.
        if (sheet) sheet.registerRule(rule)
        return
      }

      const changed = Renderer.setSelector(rule.renderable, newSelector)

      if (changed) {
        sheet.registerRule(rule)
        return
      }

      // If selector setter is not implemented, rerender the sheet.
      // We need to delete renderable from the rule, because when sheet.deploy()
      // calls rule.toString, it will get the old selector.
      delete rule.renderable
      sheet
        .registerRule(rule)
        .deploy()
        .link()
    }
  })

  /**
   * Get or set a style property.
   *
   * @param {String} name
   * @param {String|Number} [value]
   * @return {Rule|String|Number}
   */
  rule.prop = (name, value) => {
    const {style} = rule.options.Renderer
    // Its a setter.
    if (value != null) {
      rule.style[name] = value
      // Only defined if option linked is true.
      if (rule.renderable) style(rule.renderable, name, value)
      return rule
    }
    // Its a getter, read the value from the DOM if its not cached.
    if (rule.renderable && rule.style[name] == null) {
      // Cache the value after we have got it from the DOM once.
      rule.style[name] = style(rule.renderable, name)
    }
    return rule.style[name]
  }

  /**
   * Apply rule to an element inline.
   *
   * @param {Element} renderable
   * @return {Rule}
   */
  rule.applyTo = (renderable) => {
    for (const prop in rule.style) {
      const value = rule.style[prop]
      const {style} = rule.options.Renderer
      if (Array.isArray(value)) {
        for (let index = 0; index < value.length; index++) {
          style(renderable, prop, value[index])
        }
      }
      else style(renderable, prop, value)
    }
    return rule
  }

  /**
   * Returns JSON representation of the rule.
   * Array of values is not supported.
   *
   * @return {Object}
   */
  rule.toJSON = () => {
    const style = Object.create(null)
    for (const prop in rule.style) {
      if (typeof rule.style[prop] != 'object') {
        style[prop] = rule.style[prop]
      }
    }
    return style
  }

  /**
   * Generates a CSS string.
   *
   * @see toCSS
   */
  rule.toString = (options) => toCSS(rule, options)

  return rule
}
