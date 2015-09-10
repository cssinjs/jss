/**
 * StyleSheet abstraction, contains rules, injects stylesheet into dom.
 *
 * Options:
 *
 *  - `media` style element attribute
 *  - `title` style element attribute
 *  - `type` style element attribute
 *  - `named` true by default - keys are names, selectors will be generated,
 *    if false - keys are global selectors.
 *  - `link` link jss Rule instances with DOM CSSRule instances so that styles,
 *  can be modified dynamically, false by default because it has some performance cost.
 *
 * @param {Object} [rules] object with selectors and declarations
 * @param {Object} [options]
 * @api public
 */
export default class StyleSheet {
  static ATTRIBUTES = ['title', 'type', 'media']

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
    this.jss = this.options.jss

    // Don't create element if we are not in a browser environment.
    if (typeof document != 'undefined') {
      this.element = this.createElement()
    }

    for (let key in rules) {
      this.createRules(key, rules[key])
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

    document.head.appendChild(this.element)

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
    this.element.parentNode.removeChild(this.element)
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
    this.element.innerHTML = '\n' + this.toString() + '\n'
    return this
  }

  /**
   * Find CSSRule objects in the DOM and link them in the corresponding Rule instance.
   *
   * @return {StyleSheet}
   * @api private
   */
  link() {
    let CSSRuleList = this.element.sheet.cssRules
    let {rules} = this
    for (let i = 0; i < CSSRuleList.length; i++) {
      let CSSRule = CSSRuleList[i]
      let rule = rules[CSSRule.selectorText]
      if (rule) rule.CSSRule = CSSRule
    }
    return this
  }

  /**
   * Add a rule to the current stylesheet. Will insert a rule also after the stylesheet
   * has been rendered first time.
   *
   * @param {Object} [key] can be selector or name if `options.named` is true
   * @param {Object} style property/value hash
   * @return {Rule}
   * @api public
   */
  addRule(key, style) {
    let rules = this.createRules(key, style)

    // Don't insert rule directly if there is no stringified version yet.
    // It will be inserted all together when .attach is called.
    if (this.deployed) {
      let {sheet} = this.element
      for (let i = 0; i < rules.length; i++) {
        let nextIndex = sheet.cssRules.length
        let rule = rules[i]
        sheet.insertRule(rule.toString(), nextIndex)
        if (this.options.link) rule.CSSRule = sheet.cssRules[nextIndex]
      }
    }
    else this.deploy()
    return rules
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
   * @param {String} key can be selector or name if `named` is true.
   * @return {Rule}
   * @api public
   */
  getRule(key) {
    return this.rules[key]
  }

  /**
   * Convert rules to a css string.
   *
   * @return {String}
   * @api public
   */
  toString() {
    let str = ''
    let {rules} = this
    let stringified = {}
    for (let key in rules) {
      let rule = rules[key]
      // We have the same rule referenced twice if using named urles.
      // By name and by selector.
      if (stringified[rule.id]) continue
      if (str) str += '\n'
      str += rules[key].toString()
      stringified[rule.id] = true
    }
    return str
  }

  /**
   * Create a rule, will not render after stylesheet was rendered the first time.
   *
   * @param {Object} [selector] if you don't pass selector - it will be generated
   * @param {Object} [style] declarations block
   * @param {Object} [options] rule options
   * @return {Array} rule can contain child rules
   * @api private
   */
  createRules(key, style, options = {}) {
    let rules = []
    let {named} = this.options
    // Scope options overwrite instance options.
    if (options.named != null) named = options.named

    let rule = this.jss.createRule(key, style, {
      sheet: this,
      named
    })
    rules.push(rule)

    this.rules[rule.selector] = rule
    if (named && !rule.isAtRule) {
      this.rules[key] = rule
      this.classes[key] = rule.className
    }

    for (key in rule.children) {
      rules.push(this.createRules(
        key,
        rule.children[key].style,
        rule.children[key].options
      ))
    }
    return rules
  }

  /**
   * Create style sheet element.
   *
   * @return {Element}
   * @api private
   */
  createElement() {
    let element = document.createElement('style')
    StyleSheet.ATTRIBUTES.forEach(name => {
      if (this[name]) element.setAttribute(name, this[name])
    })
    return element
  }
}
