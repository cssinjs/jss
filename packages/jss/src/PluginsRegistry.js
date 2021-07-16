import warning from 'tiny-warning'

export default class PluginsRegistry {
  plugins = {
    internal: [],
    external: []
  }

  registry = {}

  /**
   * Call `onCreateRule` hooks and return an object if returned by a hook.
   */
  onCreateRule(name, decl, options) {
    for (let i = 0; i < this.registry.onCreateRule.length; i++) {
      const rule = this.registry.onCreateRule[i](name, decl, options)
      if (rule) return rule
    }

    return null
  }

  /**
   * Call `onProcessRule` hooks.
   */
  onProcessRule(rule) {
    if (rule.isProcessed) return
    const {sheet} = rule.options
    for (let i = 0; i < this.registry.onProcessRule.length; i++) {
      this.registry.onProcessRule[i](rule, sheet)
    }

    if (rule.style) this.onProcessStyle(rule.style, rule, sheet)

    rule.isProcessed = true
  }

  /**
   * Call `onProcessStyle` hooks.
   */
  onProcessStyle(style, rule, sheet) {
    for (let i = 0; i < this.registry.onProcessStyle.length; i++) {
      rule.style = this.registry.onProcessStyle[i](rule.style, rule, sheet)
    }
  }

  /**
   * Call `onProcessSheet` hooks.
   */
  onProcessSheet(sheet) {
    for (let i = 0; i < this.registry.onProcessSheet.length; i++) {
      this.registry.onProcessSheet[i](sheet)
    }
  }

  /**
   * Call `onUpdate` hooks.
   */
  onUpdate(data, rule, sheet, options) {
    for (let i = 0; i < this.registry.onUpdate.length; i++) {
      this.registry.onUpdate[i](data, rule, sheet, options)
    }
  }

  /**
   * Call `onChangeValue` hooks.
   */
  onChangeValue(value, prop, rule) {
    let processedValue = value
    for (let i = 0; i < this.registry.onChangeValue.length; i++) {
      processedValue = this.registry.onChangeValue[i](processedValue, prop, rule)
    }
    return processedValue
  }

  /**
   * Register a plugin.
   */
  use(newPlugin, options = {queue: 'external'}) {
    const plugins = this.plugins[options.queue]

    // Avoids applying same plugin twice, at least based on ref.
    if (plugins.indexOf(newPlugin) !== -1) {
      return
    }

    plugins.push(newPlugin)

    this.registry = [...this.plugins.external, ...this.plugins.internal].reduce(
      (registry, plugin) => {
        for (const name in plugin) {
          if (name in registry) {
            registry[name].push(plugin[name])
          } else {
            warning(false, `[JSS] Unknown hook "${name}".`)
          }
        }
        return registry
      },
      {
        onCreateRule: [],
        onProcessRule: [],
        onProcessStyle: [],
        onProcessSheet: [],
        onChangeValue: [],
        onUpdate: []
      }
    )
  }
}
