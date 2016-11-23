import RulesContainer from '../RulesContainer'

/**
 * Conditional rule for @media, @supports
 *
 * @api public
 */
export default class ConditionalRule {
  type = 'conditional'

  constructor(selector, rules, options) {
    this.selector = selector
    this.options = options
    this.rules = new RulesContainer({...options, parent: this})
    for (const name in rules) {
      this.createAndRegisterRule(name, rules[name])
    }

    options.jss.plugins.handleRules(this.rules.getIndex())
  }

  /**
   * Get a rule.
   *
   * @see RulesContainer.get()
   * @api public
   */
  getRule(name) {
    return this.rules.get(name)
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
   * Create and register rule, run plugins.
   *
   * Will not render after style sheet was rendered the first time.
   * Will link the rule in `this.rules`.
   *
   * @see createRule
   * @api public
   */
  addRule(name, style, options) {
    return this.rules.create(name, style, this.getChildOptions(options))
  }

  /**
   * Generates a CSS string.
   *
   * @return {String}
   * @api public
   */
  toString() {
    const inner = this.rules.toString({indentationLevel: 1})
    if (!inner) return ''
    return `${this.selector} {\n${inner}\n}`
  }

  /**
   * Build options object for a child rule.
   *
   * @param {Object} options
   * @api private
   * @return {Object}
   */
  getChildOptions(options) {
    return {...this.options, parent: this, ...options}
  }

  /**
   * Create and register a rule.
   *
   * @see RulesContainer.createAndRegister()
   * @api private
   */
  createAndRegisterRule(name, style) {
    return this.rules.createAndRegister(name, style, this.getChildOptions())
  }
}
