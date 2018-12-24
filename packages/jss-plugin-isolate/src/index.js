// @flow
import inheritedInitials from 'css-initials/inherited'
import allInitials from 'css-initials/all'
import type {Plugin, StyleRule} from 'jss'

type Options = {
  isolate?: boolean | string,
  reset?: 'all' | 'inherited' | Object | ['all' | 'inherited', Object]
}

const resetSheetOptions = {
  meta: 'jss-plugin-isolate',
  // Lets make it always the first one in sheets for testing
  // and specificity.
  index: -Infinity,
  link: true
}

const initialsMap = {
  inherited: inheritedInitials,
  all: allInitials
}

const getStyle = (option = 'inherited') => {
  // Option is either "inherited" or "all".
  if (typeof option === 'string') return initialsMap[option]

  if (typeof option === 'object') {
    // Option is ["all/inherited", {...style}]
    if (Array.isArray(option)) {
      const type = option[0]
      const style = option[1]
      return {...initialsMap[type], ...style}
    }
    // Option is a style object, use inherited initials by default.
    return {...inheritedInitials, ...option}
  }

  return inheritedInitials
}

const shouldIsolate = (rule: StyleRule, sheet, options) => {
  const {parent} = rule.options

  if (parent && (parent.type === 'keyframes' || parent.type === 'conditional')) {
    return false
  }

  let isolate = options.isolate == null ? true : options.isolate
  // $FlowFixMe: isolate is only added as an option by this plugin which means we can't type it in jss
  if (sheet.options.isolate != null) isolate = sheet.options.isolate
  if (rule.style.isolate != null) {
    isolate = rule.style.isolate
    delete rule.style.isolate
  }

  // Option `isolate` may be for e.g. `{isolate: 'root'}`.
  // In this case it must match the rule name in order to isolate it.
  if (typeof isolate === 'string') {
    return isolate === rule.key
  }

  return isolate
}

/**
 * Performance optimized debounce without using setTimeout.
 * Returns a function which:
 * - will execute the passed fn not more than once per delay
 * - will not execute the passed fn if last try was within delay
 */
const createDebounced = (fn, delay = 3) => {
  let time = Date.now()
  return () => {
    const now = Date.now()
    if (now - time < delay) return false
    time = now
    fn()
    return true
  }
}

export default function jssIsolate(options: Options = {}): Plugin {
  let setSelectorDone = false
  const selectors = []
  let resetSheet
  let resetRule: StyleRule

  const setSelector = () => {
    resetRule.selector = selectors.join(',\n')
  }

  const setSelectorDebounced = createDebounced(setSelector)

  function onProcessRule(rule, sheet) {
    if (!sheet || sheet === resetSheet || rule.type !== 'style') return

    // Type it as a StyleRule
    const styleRule: StyleRule = (rule: any)

    if (!shouldIsolate(styleRule, sheet, options)) return

    // Create a reset Style Sheet once and use it for all rules.
    if (!resetRule) {
      resetSheet = rule.options.jss.createStyleSheet({}, resetSheetOptions)
      resetRule = ((resetSheet.addRule('reset', getStyle(options.reset)): any): StyleRule)
      resetSheet.attach()
    }

    // Add reset rule class name to the classes map of users Style Sheet.
    const {selector} = styleRule
    if (selectors.indexOf(selector) === -1) {
      selectors.push(selector)
      setSelectorDone = setSelectorDebounced()
    }
  }

  // We make sure selector is set, because `debaunceMaybe` will not execute
  // the fn if called within delay.
  function onProcessSheet() {
    if (!setSelectorDone && selectors.length) setSelector()
  }

  return {
    onProcessRule,
    onProcessSheet
  }
}
