import warning from 'warning'

/**
 * Set selector.
 *
 * @param {Object} original rule
 * @param {String} className class string
 * @return {Boolean} flag, indicating function was successfull or not
 */
function registerClass(rule, className) {
  // Skip falsy values
  if (!className) return true

  // Support array of class names `{composes: ['foo', 'bar']}`
  if (Array.isArray(className)) {
    for (let index = 0; index < className.length; index++) {
      const isSetted = registerClass(rule, className[index])
      if (!isSetted) return false
    }

    return true
  }

  // Support space separated class names `{composes: 'foo bar'}`
  if (className.indexOf(' ') > -1) {
    return registerClass(rule, className.split(' '))
  }

  const {parent} = rule.options

  // It is a ref to a local rule.
  if (className[0] === '$') {
    const refRule = parent.getRule(className.substr(1))

    if (!refRule) {
      warning(false, '[JSS] Referenced rule is not defined. \r\n%s', rule)
      return false
    }

    if (refRule === rule) {
      warning(false, '[JSS] Cyclic composition detected. \r\n%s', rule)
      return false
    }

    parent.classes[rule.key] += ` ${parent.classes[refRule.key]}`

    return true
  }

  rule.options.parent.classes[rule.key] += ` ${className}`

  return true
}

/**
 * Convert compose property to additional class, remove property from original styles.
 *
 * @param {Rule} rule
 * @api public
 */
export default function jssCompose() {
  function onProcessStyle(style, rule) {
    if (!style.composes) return style
    registerClass(rule, style.composes)
    // Remove composes property to prevent infinite loop.
    delete style.composes
    return style
  }
  return {onProcessStyle}
}
