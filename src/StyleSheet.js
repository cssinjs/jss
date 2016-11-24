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
 * - `link` link jss `Rule` instances with DOM `CSSRule` instances so that styles, can be modified
 * dynamically, false by default because it has some performance cost.
 * - `element` style element, will create one by default
 *
 * @param {Object} [rules] object with selectors and declarations
 * @param {Object} [options]
 * @api public
 */
export default class StyleSheet {
  constructor(styles, options) {
    const index = typeof options.index === 'number' ? options.index : 0
    const Renderer = findRenderer(options)

    // Rules registry for access by .getRule() method.
    // It contains the same rule registered by name and by class name.
    this.rules = Object.create(null)
    this.attached = false
    this.deployed = false
    this.linked = false
    this.classes = Object.create(null)
    this.renderer = new Renderer(options)
    this.renderer.createElement()
    this.options = {
      ...options,
      sheet: this,
      parent: this,
      classes: this.classes,
      renderer: this.renderer,
      index,
      Renderer
    }
    this.rules = new RulesContainer(this.options)

    for (const name in styles) {
      this.rules.createAndRegister(name, styles[name])
    }

    const {plugins} = options.jss
    this.rules.getIndex().forEach(plugins.onProcess, plugins)
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
   * Options:
   *   - `index` rule position, will be pushed at the end if undefined.
   *
   * @param {String} [name] rule name
   * @param {Object} style property/value hash
   * @param {Object} [options]
   * @return {Rule}
   * @api public
   */
  addRule(name, style, options) {
    const {queue} = this

    // Plugins can create rules.
    // In order to preserve the right order, we need to queue all `.addRule` calls,
    // which happen after the first `rules.create()` call.
    if (this.attached && !queue) this.queue = []

    const rule = this.rules.create(name, style, options)

    if (this.attached) {
      if (!this.deployed) return rule
      // Don't insert rule directly if there is no stringified version yet.
      // It will be inserted all together when .attach is called.
      if (queue) queue.push(rule)
      else {
        const renderable = this.renderer.insertRule(rule)
        if (this.options.link) rule.renderable = renderable
        if (this.queue) {
          this.queue.forEach(this.renderer.insertRule, this.renderer)
          this.queue = null
        }
      }
      return rule
    }

    // We can't add rules to a detached style node.
    // We will redeploy the sheet once user will attach it.
    this.deployed = false

    return rule
  }

  /**
   * Create and add rules.
   * Will render also after Style Sheet was rendered the first time.
   *
   * @param {Object} styles
   * @param {Object} [options]
   * @return {Array} array of added rules
   * @api public
   */
  addRules(styles, options) {
    const added = []
    for (const name in styles) {
      added.push(this.addRule(name, styles[name], options))
    }
    return added
  }

  /**
   * Get a rule.
   *
   * @see RulesContainer#get()
   * @api public
   */
  getRule(name) {
    return this.rules.get(name)
  }

  /**
   * Delete a rule.
   *
   * @param {String} name
   * @return {Boolean} true if rule has been deleted from the DOM.
   * @api public
   */
  deleteRule(name) {
    const rule = this.rules.get(name)

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
   * @see RulesContainer.toString()
   * @api public
   */
  toString(options) {
    return this.rules.toString(options)
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
    const cssRules = this.renderer.getRules()
    for (let i = 0; i < cssRules.length; i++) {
      const CSSRule = cssRules[i]
      const rule = this.rules.get(CSSRule.selectorText)
      if (rule) rule.renderable = CSSRule
    }
    this.linked = true
    return this
  }
}
