import warning from 'tiny-warning'

// cssfn:
import {
  parseSelectors,
  flatMapSelectors,
  selectorsToString,
}                           from '@cssfn/css-selector'

const refRegExp = /\$([\w-]+)/g

/**
 * Convert nested rules to separate, remove them from original styles.
 */
export default function jssNested() {
  // Get a function to be used for $ref replacement.
  function getReplaceRef(container, sheet) {
    return (match, key) => {
      const rule = container.getRule(key) || (sheet && sheet.getRule(key))
      if (rule) {
        return rule.selector
      }

      warning(
        false,
        `[JSS] Could not find the referenced rule "${key}" in "${
          container.options.meta || container.toString()
        }".`
      )
      return key
    }
  }

  const combineSelector = (parentSelector, nestedSelector) => {
    const parentSelectors = parentSelector ? parseSelectors(parentSelector) : [[]];
    if (!parentSelectors) return null; // parsing error => invalid selector

    const nestedSelectors = parseSelectors(nestedSelector);
    if (!nestedSelectors) return null; // parsing error => invalid selector



    const combinedSelectors = (
      parentSelectors
        .flatMap((parentSelector) =>
          flatMapSelectors(nestedSelectors, (selector) => {
            const [
              /*
                selector types:
                '&'  = parent         selector
                '*'  = universal      selector
                '['  = attribute      selector
                ''   = element        selector
                '#'  = ID             selector
                '.'  = class          selector
                ':'  = pseudo class   selector
                '::' = pseudo element selector
              */
              selectorType,

              /*
                selector name:
                string = the name of [element, ID, class, pseudo class, pseudo element] selector
              */
              // selectorName,

              /*
                selector parameter(s):
                string       = the parameter of pseudo class selector, eg: nth-child(2n+3) => '2n+3'
                array        = [name, operator, value, options] of attribute selector, eg: [data-msg*="you & me" i] => ['data-msg', '*=', 'you & me', 'i']
                SelectorList = nested selector(s) of pseudo class [:is(...), :where(...), :not(...)]
              */
              // selectorParams,
            ] = selector;



            // we're only interested of selector type '&'

            // replace selector type of `&` with `parentSelector`:
            if (selectorType === '&') return parentSelector;

            // preserve the another selector types:
            return selector;
          })
        )
    );

    // convert back the parsed_object_tree to string:
    return selectorsToString(combinedSelectors);
  };

  function getOptions(rule, container, prevOptions) {
    // Options has been already created, now we only increase index.
    if (prevOptions) return {...prevOptions, index: prevOptions.index + 1}

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

  function onProcessStyle(style, rule, sheet) {
    if (rule.type !== 'style') return style

    const styleRule = rule

    const container = styleRule.options.parent
    let options
    let replaceRef
    for (const prop in style) {
      const isNested = prop.indexOf('&') !== -1
      const isNestedConditional = (prop[0] === '@') && !['@font-face', '@keyframes'].includes(prop);

      if (!isNested && !isNestedConditional) continue

      options = getOptions(styleRule, container, options)

      if (isNested) {
        let selector = combineSelector(styleRule.selector, prop)
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
          .addRule(styleRule.key, style[prop], {selector: styleRule.selector})
      }

      delete style[prop]
    }

    return style
  }

  return {onProcessStyle}
}
