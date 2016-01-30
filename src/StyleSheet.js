import createRule from './createRule'
import findRenderer from './findRenderer'

/**
 * StyleSheet model.
 *
 * Options:
 *
 *  - 'media' style element attribute
 *  - 'title' style element attribute
 *  - 'type' style element attribute
 *  - 'named' true by default - keys are names, selectors will be generated,
 *    if false - keys are global selectors
 *  - 'link' link renderable CSS rules with their corresponding models, false
 *    by default because fast by default
 *
 * @param {Object} [rules] object with selectors and declarations
 * @param {Object} [options]
 * @api public
 */
export default class StyleSheet {
  constructor(rules, options) {
    this.options = {...options}
    if (this.options.named == null) this.options.named = true
    this.rules = Object.create(null)
    this.classes = Object.create(null)
    this.attached = false
    this.deployed = false
    this.linked = false

    const Renderer = findRenderer(this.options)
    this.options.Renderer = Renderer
    this.renderer = new Renderer(this.options)

    for (const name in rules) {
      this.createRule(name, rules[name])
    }
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
   * @param {Object} [name] can be selector or name if ´options.named is true
   * @param {Object} style property/value hash
   * @return {Rule}
   * @api public
   */
  addRule(name, style) {
    const rule = this.createRule(name, style)
    // Don't insert rule directly if there is no stringified version yet.
    // It will be inserted all together when .attach is called.
    if (this.deployed) {
      const renderable = this.renderer.insertRule(rule)
      if (this.options.link) rule.renderable = renderable
    }
    return rule
  }

  /**
   * Create rules, will render also after stylesheet was rendered the first time.
   *
   * @param {Object} rules name:style hash.
   * @return {Array} array of added rules
   * @api public
   */
  addRules(rules) {
    const added = []
    for (const name in rules) {
      added.push(this.addRule(name, rules[name]))
    }
    return added
  }

  /**
   * Get a rule.
   *
   * @param {String} name can be selector or name if `named` option is true.
   * @return {Rule}
   * @api public
   */
  getRule(name) {
    return this.rules[name]
  }

  /**
   * Convert rules to a CSS string.
   *
   * @param {Object} options
   * @return {String}
   * @api public
   */
  toString(options) {
    const {rules} = this
    const stringified = Object.create(null)
    let str = ''
    for (const name in rules) {
      const rule = rules[name]
      // We have the same rule referenced twice if using named rules.
      // By name and by selector.
      if (stringified[rule.id]) {
        continue
      }

      if (rule.style && Object.keys(rule.style).length === 0) {
        continue
      }

      if (str) str += '\n'

      str += rule.toString(options)
      stringified[rule.id] = true
    }
    return str
  }

  /**
   * Create a rule, will not render after stylesheet was rendered the first time.
   * Will link the rule in `this.rules`.
   *
   * @see createRule
   * @api private
   */
  createRule(name, style, options) {
    options = {
      ...options,
      sheet: this,
      jss: this.options.jss,
      Renderer: this.options.Renderer
    }
    // Scope options overwrite instance options.
    if (options.named == null) options.named = this.options.named
    const rule = createRule(name, style, options)
    // Register conditional rule, it will stringify it's child rules properly.
    if (rule.type === 'conditional') {
      this.rules[rule.selector] = rule
    }
    else if (rule.type === 'simple') {
      this.rules[rule.name] = rule
    }
    // This is a rule which is a child of a condtional rule.
    // We need to register its class name only.
    else if (rule.options.parent && rule.options.parent.type === 'conditional') {
      // Only named rules should be referenced in `classes`.
      if (rule.options.named) this.classes[name] = rule.className
    }
    else {
      this.rules[rule.selector] = rule
      if (options.named) {
        this.rules[name] = rule
        this.classes[name] = rule.className
      }
    }
    options.jss.plugins.run(rule)
    return rule
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
      const rule = this.rules[selector]
      if (rule) rule.renderable = renderables[selector]
    }
    this.linked = true
    return this
  }
}
