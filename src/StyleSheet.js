import findRenderer from './findRenderer'
import RulesContainer from './RulesContainer'

/**
 * StyleSheet model.
 *
 * Options:
 *
 * - `media` media query - attribute of style element.
 * - `meta` meta information about this style - attribute of style element, for e.g. you could pass
 * component name for easier debugging.
 * - `named` true by default - keys are names, selectors will be generated, if false - keys are
 * global selectors.
 * - `link` link jss `Rule` instances with DOM `CSSRule` instances so that styles, can be modified
 * dynamically, false by default because it has some performance cost.
 * - `element` style element, will create one by default
 *
 * @param {Object} [rules] object with selectors and declarations
 * @param {Object} [options]
 * @api public
 */
export default class StyleSheet {
  constructor(rules, options) {
    this.options = {...options}
    if (this.options.named == null) this.options.named = true
    if (typeof this.options.index !== 'number') this.options.index = 0
    // Rules registry for access by .getRule() method.
    // It contains the same rule registered by name and by class name.
    this.rules = Object.create(null)
    // Used to ensure correct rules order.
    this.rulesIndex = []
    this.classes = this.options.classes = Object.create(null)
    this.attached = false
    this.deployed = false
    this.linked = false

    const Renderer = findRenderer(this.options)
    this.options.Renderer = Renderer
    this.renderer = this.options.renderer = new Renderer(this.options)
    this.renderer.createElement()

    this.options.sheet = this
    this.options.parent = this
    this.rules = new RulesContainer(this.options)

    for (const name in rules) {
      this.rules.createAndRegister(name, rules[name])
    }

    const {plugins} = this.options.jss
    this.rules.index.forEach(plugins.run, plugins)
  }

  /**
   * Attach renderable to the render tree.
   *
   * @api public
   * @return {StyleSheet}
   */
  attach() {
    if (this.attached) return this
    if (!this.deployed) this.deploy()
    this.renderer.attach()
    if (!this.linked && this.options.link) this.link()
    this.attached = true
    return this
  }

  /**
   * Remove renderable from render tree.
   *
   * @return {StyleSheet}
   * @api public
   */
  detach() {
    if (!this.attached) return this
    this.renderer.detach()
    this.attached = false
    return this
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
    // We can't add rules to a detached style node.
    // We will redeploy the sheet once user will attach it.
    }
    else {
      this.deployed = false
    }

    return rule
  }

  /**
   * Create rules, will render also after stylesheet was rendered the first time.
   *
   * @param {Object} rules name:style hash.
   * @param {Object} [options]
   * @return {Array} array of added rules
   * @api public
   */
  addRules(rules, options) {
    const added = []
    for (const name in rules) {
      added.push(this.addRule(name, rules[name], options))
    }
    return added
  }

  /**
   * Get a rule.
   *
   * @see RulesContainer.get()
   * @api public
   */
  getRule(nameOrSelector) {
    return this.rules.get(nameOrSelector)
  }

  /**
   * Delete a rule.
   *
   * @param {String} rule selector or name
   * @return {Boolean} true if rule has been deleted from the DOM.
   * @api public
   */
  deleteRule(nameOrSelector) {
    const rule = this.rules.get(nameOrSelector)

    if (!rule) return false

    this.rules.remove(rule)

    if (this.attached) {
      return this.renderer.deleteRule(rule.renderable)
    }

    return true
  }


  /**
   * Get index of a rule.
   *
   * @see RulesContainer.indexOf()
   * @api public
   */
  indexOf(rule) {
    return this.rules.indexOf(rule)
  }

  /**
   * Convert rules to a CSS string.
   *
   * @param {Object} options
   * @return {String}
   * @api public
   */
  toString(options) {
    return this.rules.toString(options)
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
  createRule(name, style, options) {
    return this.rules.create(name, style, options)
  }

  /**
   * Deploy pure CSS string to a renderable.
   *
   * @return {StyleSheet}
   * @api private
   */
  deploy() {
    this.renderer.deploy(this)
    this.deployed = true
    return this
  }

  /**
   * Link renderable CSS rules with their corresponding models.
   *
   * @return {StyleSheet}
   * @api private
   */
  link() {
    const renderables = this.renderer.getRules()
    for (const selector in renderables) {
      const rule = this.rules.get(selector)
      if (rule) rule.renderable = renderables[selector]
    }
    this.linked = true
    return this
  }
}
