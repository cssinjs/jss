import RuleList from './RuleList'

export default class StyleSheet {
  constructor(styles, options) {
    this.attached = false
    this.deployed = false
    this.classes = {}
    this.keyframes = {}
    this.options = {
      ...options,
      sheet: this,
      parent: this,
      classes: this.classes,
      keyframes: this.keyframes
    }
    if (options.Renderer) {
      this.renderer = new options.Renderer(this)
    }
    this.rules = new RuleList(this.options)

    for (const name in styles) {
      this.rules.add(name, styles[name])
    }

    this.rules.process()
  }

  /**
   * Attach renderable to the render tree.
   */
  attach() {
    if (this.attached) return this
    if (this.renderer) this.renderer.attach()
    this.attached = true
    // Order is important, because we can't use insertRule API if style element is not attached.
    if (!this.deployed) this.deploy()
    return this
  }

  /**
   * Remove renderable from render tree.
   */
  detach() {
    if (!this.attached) return this
    if (this.renderer) this.renderer.detach()
    this.attached = false
    return this
  }

  /**
   * Add a rule to the current stylesheet.
   * Will insert a rule also after the stylesheet has been rendered first time.
   */
  addRule(name, decl, options) {
    const {queue} = this

    // Plugins can create rules.
    // In order to preserve the right order, we need to queue all `.addRule` calls,
    // which happen after the first `rules.add()` call.
    if (this.attached && !queue) this.queue = []

    const rule = this.rules.add(name, decl, options)

    if (!rule) return null

    this.options.jss.plugins.onProcessRule(rule)

    if (this.attached) {
      if (!this.deployed) return rule
      // Don't insert rule directly if there is no stringified version yet.
      // It will be inserted all together when .attach is called.
      if (queue) queue.push(rule)
      else {
        this.insertRule(rule)
        if (this.queue) {
          this.queue.forEach(this.insertRule, this)
          this.queue = undefined
        }
      }
      return rule
    }

    // We can't add rules to a detached style node.
    // We will redeploy the sheet once user will attach it.
    this.deployed = false

    return rule
  }

  /**
   * Replace a rule in the current stylesheet.
   */
  replaceRule(nameOrSelector, decl, options) {
    const oldRule = this.rules.get(nameOrSelector)
    if (!oldRule) return this.addRule(nameOrSelector, decl, options)

    const newRule = this.rules.replace(nameOrSelector, decl, options)

    if (newRule) {
      this.options.jss.plugins.onProcessRule(newRule)
    }

    if (this.attached) {
      if (!this.deployed) return newRule
      // Don't replace / delete rule directly if there is no stringified version yet.
      // It will be inserted all together when .attach is called.
      if (this.renderer) {
        if (!newRule) {
          this.renderer.deleteRule(oldRule)
        } else if (oldRule.renderable) {
          this.renderer.replaceRule(oldRule.renderable, newRule)
        }
      }
      return newRule
    }

    // We can't replace rules to a detached style node.
    // We will redeploy the sheet once user will attach it.
    this.deployed = false

    return newRule
  }

  /**
   * Insert rule into the StyleSheet
   */
  insertRule(rule) {
    if (this.renderer) {
      this.renderer.insertRule(rule)
    }
  }

  /**
   * Create and add rules.
   * Will render also after Style Sheet was rendered the first time.
   */
  addRules(styles, options) {
    const added = []
    for (const name in styles) {
      const rule = this.addRule(name, styles[name], options)
      if (rule) added.push(rule)
    }
    return added
  }

  /**
   * Get a rule by name or selector.
   */
  getRule(nameOrSelector) {
    return this.rules.get(nameOrSelector)
  }

  /**
   * Delete a rule by name.
   * Returns `true`: if rule has been deleted from the DOM.
   */
  deleteRule(name) {
    const rule = typeof name === 'object' ? name : this.rules.get(name)

    if (
      !rule ||
      // Style sheet was created without link: true and attached, in this case we
      // won't be able to remove the CSS rule from the DOM.
      (this.attached && !rule.renderable)
    ) {
      return false
    }

    this.rules.remove(rule)

    if (this.attached && rule.renderable && this.renderer) {
      return this.renderer.deleteRule(rule.renderable)
    }

    return true
  }

  /**
   * Get index of a rule.
   */
  indexOf(rule) {
    return this.rules.indexOf(rule)
  }

  /**
   * Deploy pure CSS string to a renderable.
   */
  deploy() {
    if (this.renderer) this.renderer.deploy()
    this.deployed = true
    return this
  }

  /**
   * Update the function values with a new data.
   */
  update(...args) {
    this.rules.update(...args)
    return this
  }

  /**
   * Updates a single rule.
   */
  updateOne(rule, data, options) {
    this.rules.updateOne(rule, data, options)
    return this
  }

  /**
   * Convert rules to a CSS string.
   */
  toString(options) {
    return this.rules.toString(options)
  }
}
