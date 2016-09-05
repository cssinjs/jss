import RulesContainer from '../RulesContainer'

/**
 * Conditional rule for @media, @supports
 *
 * @api public
 */
export default class ConditionalRule {
  constructor(selector, rules, options) {
    this.type = 'conditional'
    this.selector = selector
    this.options = options
    this.rules = new RulesContainer({...options, parent: this})
    for (const name in rules) {
      this.createAndRegisterRule(name, rules[name])
    }

    const {plugins} = options.jss
    this.rules.index.forEach(plugins.run, plugins)
  }

  createAndRegisterRule(name, style) {
    return this.rules.createAndRegister(name, style, this.getChildOptions())
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

  getChildOptions(options) {
    return {...this.options, parent: this, ...options}
  }

  /**
   * A conditional rule always contains child rules.
   *
   * @param {String} name
   * @param {Object} styles
   * @param {Object} [options]
   * @return {Rule}
   * @api public
   */
   /*
  createRule(name, style, options) {
    let newOptions = {...this.options, parent: this}
    const {sheet, jss} = newOptions
    // We have already a rule in the current style sheet with this name,
    // This new rule is supposed to overwrite the first one, for this we need
    // to ensure it will have the same className/selector.
    const existingRule = sheet && sheet.getRule(name)
    const className = existingRule ? existingRule.className : null
    if (className || options) {
      newOptions = {...newOptions, className, ...options}
    }
    const rule = (sheet || jss).createRule(name, style, newOptions)
    this.rules[name] = rule
    return rule
  }
*/
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
}
