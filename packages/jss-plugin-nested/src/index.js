// @flow
import warning from 'tiny-warning'
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
  function getReplaceRef(container, sheet?: StyleSheet) {
    return (match, key) => {
      let rule = container.getRule(key) || (sheet && sheet.getRule(key))
      if (rule) {
        rule = ((rule: any): StyleRule)

        return rule.selector
      }

      warning(
        false,
        `[JSS] Could not find the referenced rule "${key}" in "${container.options.meta ||
          container.toString()}".`
      )
      return key
    }
  }

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
        result +=
          nested.indexOf('&') !== -1 ? nested.replace(parentRegExp, parent) : `${parent} ${nested}`
      }
    }

    return result
  }

  function getOptions(rule, container, prevOptions) {
    // Options has been already created, now we only increase index.
    if (prevOptions) return {...prevOptions, index: prevOptions.index + 1}

    // $FlowFixMe[prop-missing]
    let {nestingLevel} = rule.options
    nestingLevel = nestingLevel === undefined ? 1 : nestingLevel + 1

    const options = {
      ...rule.options,
      nestingLevel,
      index: container.indexOf(rule) + 1
    }
    // We don't need the parent name to be set options for chlid.
    delete options.name
    return options
  }

  function onProcessStyle(style, rule, sheet?: StyleSheet) {
    if (rule.type !== 'style') return style

    const styleRule: StyleRule = (rule: any)

    const container: StyleSheet = (styleRule.options.parent: any)
    let options
    let replaceRef
    for (const prop in style) {
      const isNested = prop.indexOf('&') !== -1
      const isNestedConditional = prop[0] === '@'

      if (!isNested && !isNestedConditional) continue

      options = getOptions(styleRule, container, options)

      if (isNested) {
        let selector = replaceParentRefs(prop, styleRule.selector)
        // Lazily create the ref replacer function just once for
        // all nested rules within the sheet.
        if (!replaceRef) replaceRef = getReplaceRef(container, sheet)
        // Replace all $refs.
        selector = selector.replace(refRegExp, replaceRef)

        container.addRule(selector, style[prop], {...options, selector})
      } else if (isNestedConditional) {
        // Place conditional right after the parent rule to ensure right ordering.
        container
          .addRule(prop, {}, options)
          // Flow expects more options but they aren't required
          // And flow doesn't know this will always be a StyleRule which has the addRule method
          // $FlowFixMe[incompatible-use]
          // $FlowFixMe[prop-missing]
          .addRule(styleRule.key, style[prop], {selector: styleRule.selector})
      }

      delete style[prop]
    }

    return style
  }

  return {onProcessStyle}
}
