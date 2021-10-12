import createRule from './utils/createRule'
import {StyleRule, KeyframesRule} from './plugins/index'
import escape from './utils/escape'
import getWhitespaceSymbols from './utils/getWhitespaceSymbols'

const defaultUpdateOptions = {
  process: true
}

const forceUpdateOptions = {
  force: true,
  process: true
}

/**
 * Contains rules objects and allows adding/removing etc.
 * Is used for e.g. by `StyleSheet` or `ConditionalRule`.
 */
export default class RuleList {
  // Rules registry for access by .get() method.
  // It contains the same rule registered by name and by selector.
  map = {}

  // Original styles object.
  raw = {}

  // Used to ensure correct rules order.
  index = []

  counter = 0

  constructor(options) {
    this.options = options
    this.classes = options.classes
    this.keyframes = options.keyframes
  }

  /**
   * Create and register rule.
   *
   * Will not render after Style Sheet was rendered the first time.
   */
  add(name, decl, ruleOptions) {
    const {parent, sheet, jss, Renderer, generateId, scoped} = this.options
    const options = {
      classes: this.classes,
      parent,
      sheet,
      jss,
      Renderer,
      generateId,
      scoped,
      name,
      keyframes: this.keyframes,
      selector: undefined,
      ...ruleOptions
    }

    // When user uses .createStyleSheet(), duplicate names are not possible, but
    // `sheet.addRule()` opens the door for any duplicate rule name. When this happens
    // we need to make the key unique within this RuleList instance scope.
    let key = name
    if (name in this.raw) {
      key = `${name}-d${this.counter++}`
    }

    // We need to save the original decl before creating the rule
    // because cache plugin needs to use it as a key to return a cached rule.
    this.raw[key] = decl

    if (key in this.classes) {
      // E.g. rules inside of @media container
      options.selector = `.${escape(this.classes[key])}`
    }

    const rule = createRule(key, decl, options)

    if (!rule) return null

    this.register(rule)

    const index = options.index === undefined ? this.index.length : options.index
    this.index.splice(index, 0, rule)

    return rule
  }

  /**
   * Replace rule.
   * Create a new rule and remove old one instead of overwriting
   * because we want to invoke onCreateRule hook to make plugins work.
   */
  replace(name, decl, ruleOptions) {
    const oldRule = this.get(name)
    const oldIndex = this.index.indexOf(oldRule)
    if (oldRule) {
      this.remove(oldRule)
    }
    let options = ruleOptions
    if (oldIndex !== -1) options = {...ruleOptions, index: oldIndex}
    return this.add(name, decl, options)
  }

  /**
   * Get a rule by name or selector.
   */
  get(nameOrSelector) {
    return this.map[nameOrSelector]
  }

  /**
   * Delete a rule.
   */
  remove(rule) {
    this.unregister(rule)
    delete this.raw[rule.key]
    this.index.splice(this.index.indexOf(rule), 1)
  }

  /**
   * Get index of a rule.
   */
  indexOf(rule) {
    return this.index.indexOf(rule)
  }

  /**
   * Run `onProcessRule()` plugins on every rule.
   */
  process() {
    const {plugins} = this.options.jss
    // We need to clone array because if we modify the index somewhere else during a loop
    // we end up with very hard-to-track-down side effects.
    this.index.slice(0).forEach(plugins.onProcessRule, plugins)
  }

  /**
   * Register a rule in `.map`, `.classes` and `.keyframes` maps.
   */
  register(rule) {
    this.map[rule.key] = rule
    if (rule instanceof StyleRule) {
      this.map[rule.selector] = rule
      if (rule.id) this.classes[rule.key] = rule.id
    } else if (rule instanceof KeyframesRule && this.keyframes) {
      this.keyframes[rule.name] = rule.id
    }
  }

  /**
   * Unregister a rule.
   */
  unregister(rule) {
    delete this.map[rule.key]
    if (rule instanceof StyleRule) {
      delete this.map[rule.selector]
      delete this.classes[rule.key]
    } else if (rule instanceof KeyframesRule) {
      delete this.keyframes[rule.name]
    }
  }

  /**
   * Update the function values with a new data.
   */
  update(...args) {
    let name
    let data
    let options

    if (typeof args[0] === 'string') {
      name = args[0]
      data = args[1]
      options = args[2]
    } else {
      data = args[0]
      options = args[1]
      name = null
    }

    if (name) {
      this.updateOne(this.get(name), data, options)
    } else {
      for (let index = 0; index < this.index.length; index++) {
        this.updateOne(this.index[index], data, options)
      }
    }
  }

  /**
   * Execute plugins, update rule props.
   */
  updateOne(rule, data, options = defaultUpdateOptions) {
    const {
      jss: {plugins},
      sheet
    } = this.options

    // It is a rules container like for e.g. ConditionalRule.
    if (rule.rules instanceof RuleList) {
      rule.rules.update(data, options)
      return
    }

    const {style} = rule

    plugins.onUpdate(data, rule, sheet, options)

    // We rely on a new `style` ref in case it was mutated during onUpdate hook.
    if (options.process && style && style !== rule.style) {
      // We need to run the plugins in case new `style` relies on syntax plugins.
      plugins.onProcessStyle(rule.style, rule, sheet)

      // Update and add props.
      for (const prop in rule.style) {
        const nextValue = rule.style[prop]
        const prevValue = style[prop]
        // We need to use `force: true` because `rule.style` has been updated during onUpdate hook, so `rule.prop()` will not update the CSSOM rule.
        // We do this comparison to avoid unneeded `rule.prop()` calls, since we have the old `style` object here.
        if (nextValue !== prevValue) {
          rule.prop(prop, nextValue, forceUpdateOptions)
        }
      }

      // Remove props.
      for (const prop in style) {
        const nextValue = rule.style[prop]
        const prevValue = style[prop]
        // We need to use `force: true` because `rule.style` has been updated during onUpdate hook, so `rule.prop()` will not update the CSSOM rule.
        // We do this comparison to avoid unneeded `rule.prop()` calls, since we have the old `style` object here.
        if (nextValue == null && nextValue !== prevValue) {
          rule.prop(prop, null, forceUpdateOptions)
        }
      }
    }
  }

  /**
   * Convert rules to a CSS string.
   */
  toString(options) {
    let str = ''
    const {sheet} = this.options
    const link = sheet ? sheet.options.link : false
    const {linebreak} = getWhitespaceSymbols(options)

    for (let index = 0; index < this.index.length; index++) {
      const rule = this.index[index]
      const css = rule.toString(options)

      // No need to render an empty rule.
      if (!css && !link) continue

      if (str) str += linebreak
      str += css
    }

    return str
  }
}
