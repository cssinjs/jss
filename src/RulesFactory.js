import warning from 'warning'

import RegularRule from './rules/RegularRule'

// Build regexp for matching rules.
const buildRegExp = classes => new RegExp(`^${Object.keys(classes).join('|')}`)

export default class RulesFactory {
  classes = {}

  /**
   * Register a new class.
   *
   * @param {String} name
   * @param {Class} cls
   * @api public
   */
  register(name, cls) {
    this.classes[name] = cls
    this.regExp = buildRegExp(this.classes)
  }

  /**
   * Create a rule instance.
   *
   * Options:
   *   - `className` pass class name if you to define it manually
   *
   * @param {Object} [name]
   * @param {Object} [style] declarations block
   * @param {Object} [options] rule options
   * @return {Object} rule
   * @api public
   */
  create(name, style = {}, options = {}) {
    let Rule = RegularRule

    // Is an at-rule.
    if (name && name[0] === '@') {
      const result = this.regExp.exec(name)
      if (result) Rule = this.classes[result[0]]
      else warning(false, '[JSS] Unknown rule %s', name)
    }

    return new Rule(name, style, options)
  }
}
