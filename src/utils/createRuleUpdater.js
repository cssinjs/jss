type ruleUpdaterOptions = {
  data: Object,
  processor: string,
  args: Array
}

/**
 * Update the function values with a new data for rule.
 */
export default RulesContainer => ({data, processor, args}: ruleUpdaterOptions) =>
  (rule: Rule): void => {
    if (rule.type === 'regular') {
      for (const prop in rule.style) {
        const value = rule.style[prop]
        if (typeof value === 'function') {
          const computedValue = value(data)
          rule.prop(prop, computedValue)
        }
      }
    }
    else if (rule.rules instanceof RulesContainer) {
      rule.rules[processor](...[].concat(args))
    }
  }
