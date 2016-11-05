/**
 * Contains rules objects and allows adding/removing etc.
 * Is used by containers liks StyleSheet or ConditionalRule.
 *
 * @api public
 */
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
    this.jss = options.jss
  }

  /**
   * Create and register rule, run plugins.
   *
   * Will not render after style sheet was rendered the first time.
   * Will link the rule in `this.rules`.
   *
   * @see RulesFactory#createRule
   * @api public
   */
  create(name, style, options) {
    const rule = this.createAndRegister(name, style, options)
    this.jss.plugins.handleRule(rule)
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
   * @param {String} nameOrSelector
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
      const css = rule.toString(options)

      if (!css) continue

      if (str) str += '\n'
      str += css
    }

    return str
  }

  /**
   * Returns a cloned index of rules.
   * We need this because if we modify the index somewhere else during a loop
   * we end up with very hard-to-track-down side effects.
   *
   * @return {Array}
   * @api public
   */
  getIndex() {
    // We need to clone the array, because while
    return this.index.slice(0)
  }

  /**
   * Create and register a rule.
   *
   * Options:
   *   - `index` rule position, will be pushed at the end if undefined.
   *
   * @see createRule
   * @api private
   */
  createAndRegister(name, style, options) {
    const {parent, sheet, jss, Renderer} = this.options

    options = {
      classes: this.classes,
      parent,
      sheet,
      jss,
      Renderer,
      applyPlugins: false,
      ...options
    }

    if (!options.className) options.className = this.classes[name]

    const rule = jss.createRule(name, style, options)
    this.register(rule)

    const index = options.index === undefined ? this.index.length : options.index
    this.index.splice(index, 0, rule)

    return rule
  }
}
