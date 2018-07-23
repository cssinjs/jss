// @flow
import warning from 'warning'
import type {Plugin, StyleRule, StyleSheet} from 'jss'

const separatorRegExp = /\s*,\s*/g
const parentRegExp = /&/g
const refRegExp = /\$([\w-]+)/g

/**
 * Convert nested rules to separate, remove them from original styles.
 *
 * @param {Rule} rule
 * @api public
 */
export default function jssNested(): Plugin {
  // Get a function to be used for $ref replacement.
  function getReplaceRef(container) {
    return (match, key) => {
      let rule = container.getRule(key)
      if (rule) {
        rule = ((rule: any): StyleRule)

        return rule.selector
      }
      warning(
        false,
        '[JSS] Could not find the referenced rule %s in %s.',
        key,
        container.options.meta || container
      )
      return key
    }
  }

  const hasAnd = str => str.indexOf('&') !== -1

  function replaceParentRefs(nestedProp, parentProp) {
    const parentSelectors = parentProp.split(separatorRegExp)
    const nestedSelectors = nestedProp.split(separatorRegExp)

    let result = ''

    for (let i = 0; i < parentSelectors.length; i++) {
      const parent = parentSelectors[i]

      for (let j = 0; j < nestedSelectors.length; j++) {
        const nested = nestedSelectors[j]
        if (result) result += ', '
        // Replace all & by the parent or prefix & with the parent.
        result += hasAnd(nested) ? nested.replace(parentRegExp, parent) : `${parent} ${nested}`
      }
    }

    return result
  }

  function getOptions(rule, container, options) {
    // Options has been already created, now we only increase index.
    if (options) return {...options, index: options.index + 1}

    // $FlowFixMe: Flow can't know that nestingLevel actually may exist here
    let {nestingLevel} = rule.options
    nestingLevel = nestingLevel === undefined ? 1 : nestingLevel + 1

    return {
      ...rule.options,
      nestingLevel,
      index: container.indexOf(rule) + 1
    }
  }

  function onProcessStyle(style, rule) {
    if (rule.type !== 'style') return style

    rule = ((rule: any): StyleRule)

    const container = ((rule.options.parent: any): StyleSheet)
    let options
    let replaceRef
    for (const prop in style) {
      const isNested = hasAnd(prop)
      const isNestedConditional = prop[0] === '@'

      if (!isNested && !isNestedConditional) continue

      options = getOptions(rule, container, options)

      if (isNested) {
        let selector = replaceParentRefs(prop, rule.selector)
        // Lazily create the ref replacer function just once for
        // all nested rules within the sheet.
        if (!replaceRef) replaceRef = getReplaceRef(container)
        // Replace all $refs.
        selector = selector.replace(refRegExp, replaceRef)

        container.addRule(selector, style[prop], {...options, selector})
      } else if (isNestedConditional) {
        // Place conditional right after the parent rule to ensure right ordering.
        container
          .addRule(prop, {}, options)
          // Flow expects more options but they aren't required
          // And flow doesn't know this will always be a StyleRule which has the addRule method
          // $FlowFixMe
          .addRule(rule.key, style[prop], {selector: rule.selector})
      }

      delete style[prop]
    }

    return style
  }

  return {onProcessStyle}
}
