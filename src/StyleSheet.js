import * as dom from './dom'

/**
 * StyleSheet abstraction, contains rules, injects stylesheet into dom.
 *
 * Options:
 *
 *  - 'media' style element attribute
 *  - 'title' style element attribute
 *  - 'type' style element attribute
 *  - 'named' true by default - keys are names, selectors will be generated,
 *    if false - keys are global selectors.
 *  - 'link' link jss Rule instances with DOM CSSRule instances so that styles,
 *  can be modified dynamically, false by default because it has some performance cost.
 *
 * @param {Object} [rules] object with selectors and declarations
 * @param {Object} [options]
 * @api public
 */
export default class StyleSheet {
  constructor(rules, options = {}) {
    if (options.named == null) options.named = true
    this.options = options
    this.element = null
    this.attached = false
    this.media = options.media
    this.type = options.type
    this.title = options.title
    this.rules = {}
    // Only when options.named: true.
    this.classes = {}
    this.deployed = false
    this.linked = false
    this.element = this.createElement()
    for (let key in rules) {
      this.createRule(key, rules[key])
    }
  }

  /**
   * Insert stylesheet element to render tree.
   *
   * @api public
   * @return {StyleSheet}
   */
  attach() {
    if (this.attached) return this
    if (!this.deployed) {
      this.deploy()
      this.deployed = true
    }

    dom.appendStyle(this.element)

    // Before element is attached to the dom rules are not created.
    if (!this.linked && this.options.link) {
      this.link()
      this.linked = true
    }
    this.attached = true
    return this
  }

  /**
   * Remove stylesheet element from render tree.
   *
   * @return {StyleSheet}
   * @api public
   */
  detach() {
    if (!this.attached) return this
    dom.removeElement(this.element)
    this.attached = false
    return this
  }

  /**
   * Deploy styles to the element.
   *
   * @return {StyleSheet}
   * @api private
   */
  deploy() {
    if (!this.element) return this
    this.element.innerHTML = `\n${this.toString()}\n`
    return this
  }

  /**
   * Find CSSRule objects in the DOM and link them in the corresponding Rule instance.
   *
   * @return {StyleSheet}
   * @api private
   */
  link() {
    let cssRules = dom.getCssRules(this.element)
    if (!cssRules) return this
    for (let i = 0; i < cssRules.length; i++) {
      let DOMRule = cssRules[i]
      let rule = this.rules[DOMRule.selectorText]
      if (rule) rule.DOMRule = DOMRule
    }
    return this
  }

  /**
   * Add a rule to the current stylesheet. Will insert a rule also after the stylesheet
   * has been rendered first time.
   *
   * @param {Object} [key] can be selector or name if 'options.named' is true
   * @param {Object} style property/value hash
   * @return {Rule}
   * @api public
   */
  addRule(key, style) {
    let rule = this.createRule(key, style)
    // Don't insert rule directly if there is no stringified version yet.
    // It will be inserted all together when .attach is called.
    if (this.deployed) {
      let DOMRule = dom.insertCssRule(this.element, rule.toString())
      if (this.options.link) rule.DOMRule = DOMRule
    }
    else this.deploy()
    return rule
  }

  /**
   * Create rules, will render also after stylesheet was rendered the first time.
   *
   * @param {Object} rules key:style hash.
   * @return {Array} array of added rules
   * @api public
   */
  addRules(rules) {
    let added = []
    for (let key in rules) {
      added.push.apply(added, this.addRule(key, rules[key]))
    }
    return added
  }

  /**
   * Get a rule.
   *
   * @param {String} key can be selector or name if 'named' is true.
   * @return {Rule}
   * @api public
   */
  getRule(key) {
    return this.rules[key]
  }

  /**
   * Convert rules to a css string.
   *
   * @param {Object} options
   * @return {String}
   * @api public
   */
  toString(options) {
    let str = ''
    let {rules} = this
    let stringified = {}
    for (let key in rules) {
      let rule = rules[key]
      // We have the same rule referenced twice if using named rules.
      // By name and by selector.
      if (stringified[rule.id]) {
        continue
      }
      if (str) str += '\n'
      str += rules[key].toString(options)
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
  createRule(key, style, options = {}) {
    // Scope options overwrite instance options.
    if (options.named == null) options.named = this.options.named
    options.sheet = this

    let rule = this.options.jss.createRule(key, style, options)

    // Register conditional rule, it will stringify it's child rules properly.
    if (rule.type === 'conditional') {
      this.rules[rule.selector] = rule
    }
    // This is a rule which is a child of a condtional rule.
    // We need to register its class name only.
    else if (rule.options.parent && rule.options.parent.type === 'conditional') {
      // Only named rules should be referenced in `classes`.
      if (rule.options.named) this.classes[key] = rule.className
    }
    else {
      this.rules[rule.selector] = rule
      if (options.named) {
        this.rules[key] = rule
        this.classes[key] = rule.className
      }
    }

    return rule
  }

  /**
   * Create style sheet element.
   *
   * @return {Element}
   * @api private
   */
  createElement() {
    return dom.createStyle(this)
  }
}
