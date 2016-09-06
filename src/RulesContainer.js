import {isEmptyObject} from './utils'
import createRule from './createRule'

export default class RulesContainer {
  constructor(options) {
    // Rules registry for access by .get() method.
    // It contains the same rule registered by name and by class name.
    this.map = Object.create(null)
    // Used to ensure correct rules order.
    this.index = []
    this.options = options
    // Default object is needed when rule is created without a sheet.
    this.classes = options.classes || {}
  }

  /**
   * Add a rule to the current stylesheet. Will insert a rule also after the stylesheet
   * has been rendered first time.
   *
   * @param {String} [name] can be selector or name if ´options.named is true
   * @param {Object} style property/value hash
   * @param {Object} [options]
   * @return {Rule}
   * @api public
   */
  addRule(name, style, options) {
    const rule = this.createRule(name, style, options)

    if (this.attached) {
      // Don't insert rule directly if there is no stringified version yet.
      // It will be inserted all together when .attach is called.
      if (this.deployed) {
        const renderable = this.renderer.insertRule(rule)
        if (this.options.link) rule.renderable = renderable
      }

      return rule
    }

    // We can't add rules to a detached style node.
    // We will redeploy the sheet once user will attach it.
    this.deployed = false

    return rule
  }

  /**
   * Create and register rule, run plugins.
   *
   * Will not render after style sheet was rendered the first time.
   * Will link the rule in `this.rules`.
   *
   * @see createRule
   * @api public
   */
  create(name, style, options) {
    const rule = this.createAndRegister(name, style, options)
    this.options.jss.plugins.run(rule)
    return rule
  }

  /**
   * Delete a rule.
   *
   * @param {String} rule selector or name
   * @return {Boolean} true if rule has been deleted from the DOM.
   * @api public
   */
  remove(rule) {
    this.unregister(rule)
    this.index.splice(this.indexOf(rule), 1)
  }

  /**
   * Get a rule.
   *
   * @param {String} nameOrSelector can be selector or name if `named` option is true.
   * @return {Rule}
   * @api public
   */
  get(nameOrSelector) {
    return this.map[nameOrSelector]
  }

  /**
   * Get index of a rule.
   *
   * @param {Rule} rule
   * @return {Number}
   * @api public
   */
  indexOf(rule) {
    return this.index.indexOf(rule)
  }

  /**
   * Create and register a rule.
   *
   * @see createRule
   * @api private
   */
  createAndRegister(name, style, options) {
    options = {
      ...options,
      classes: this.classes,
      parent: this.options.parent,
      sheet: this.options.sheet,
      jss: this.options.jss,
      Renderer: this.options.Renderer
    }

    // Currently the only case where we have no class name is child rules of
    // some conditional rule.
    if (!options.className) options.className = this.classes[name]

    // Scope options overwrite instance options.
    if (options.named == null) options.named = this.options.named
    const rule = createRule(name, style, options)
    this.register(rule)

    const index = options.index === undefined ? this.index.length : options.index
    this.index.splice(index, 0, rule)

    return rule
  }

  /**
   * Register a rule in `.map` and `.classes` maps.
   *
   * @param {Rule} rule
   * @api public
   */
  register(rule) {
    if (rule.name) this.map[rule.name] = rule
    if (rule.className && rule.name) this.classes[rule.name] = rule.className
    if (rule.selector) this.map[rule.selector] = rule
    return this
  }

  /**
   * Unregister a rule.
   *
   * @param {Rule} rule
   * @api public
   */
  unregister(rule) {
    delete this.map[rule.name]
    delete this.map[rule.selector]
    delete this.classes[rule.name]
    return this
  }

  /**
   * Convert rules to a CSS string.
   *
   * @param {Object} options
   * @return {String}
   * @api public
   */
  toString(options) {
    let str = ''
    for (let index = 0; index < this.index.length; index++) {
      const rule = this.index[index]
      // Regular rules.
      if (rule.style && isEmptyObject(rule.style)) {
        continue
      }

      // Conditional rules.
      if (rule.rules && isEmptyObject(rule.rules)) {
        continue
      }

      const nextRuleCss = rule.toString(options)

      if (str && nextRuleCss) str += '\n'

      str += nextRuleCss
    }

    return str
  }
}
