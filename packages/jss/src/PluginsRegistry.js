/* @flow */
import warning from 'tiny-warning'
import type StyleSheet from './StyleSheet'
import type {
  Plugin,
  Rule,
  RuleOptions,
  UpdateOptions,
  JssStyle,
  JssValue,
  OnCreateRule,
  OnProcessRule,
  OnProcessStyle,
  OnProcessSheet,
  OnChangeValue,
  OnUpdate
} from './types'
import type {StyleRule} from './plugins/styleRule'

type Registry = {
  onCreateRule: Array<OnCreateRule>,
  onProcessRule: Array<OnProcessRule>,
  onProcessStyle: Array<OnProcessStyle>,
  onProcessSheet: Array<OnProcessSheet>,
  onChangeValue: Array<OnChangeValue>,
  onUpdate: Array<OnUpdate>
}

export default class PluginsRegistry {
  plugins: {
    internal: Array<Plugin>,
    external: Array<Plugin>
  } = {
    internal: [],
    external: []
  }

  registry: Registry

  /**
   * Call `onCreateRule` hooks and return an object if returned by a hook.
   */
  onCreateRule(name?: string, decl: JssStyle, options: RuleOptions): Rule | null {
    for (let i = 0; i < this.registry.onCreateRule.length; i++) {
      const rule = this.registry.onCreateRule[i](name, decl, options)
      if (rule) return rule
    }

    return null
  }

  /**
   * Call `onProcessRule` hooks.
   */
  onProcessRule(rule: Rule): void {
    if (rule.isProcessed) return
    const {sheet} = rule.options
    for (let i = 0; i < this.registry.onProcessRule.length; i++) {
      this.registry.onProcessRule[i](rule, sheet)
    }

    // $FlowFixMe
    if (rule.style) this.onProcessStyle(rule.style, rule, sheet)

    rule.isProcessed = true
  }

  /**
   * Call `onProcessStyle` hooks.
   */
  onProcessStyle(style: JssStyle, rule: Rule, sheet?: StyleSheet): void {
    for (let i = 0; i < this.registry.onProcessStyle.length; i++) {
      // $FlowFixMe
      rule.style = this.registry.onProcessStyle[i](rule.style, rule, sheet)
    }
  }

  /**
   * Call `onProcessSheet` hooks.
   */
  onProcessSheet(sheet: StyleSheet): void {
    for (let i = 0; i < this.registry.onProcessSheet.length; i++) {
      this.registry.onProcessSheet[i](sheet)
    }
  }

  /**
   * Call `onUpdate` hooks.
   */
  onUpdate(data: Object, rule: Rule, sheet: StyleSheet, options: UpdateOptions): void {
    for (let i = 0; i < this.registry.onUpdate.length; i++) {
      this.registry.onUpdate[i](data, rule, sheet, options)
    }
  }

  /**
   * Call `onChangeValue` hooks.
   */
  onChangeValue(value: JssValue, prop: string, rule: StyleRule): JssValue {
    let processedValue = value
    for (let i = 0; i < this.registry.onChangeValue.length; i++) {
      processedValue = this.registry.onChangeValue[i](processedValue, prop, rule)
    }
    return processedValue
  }

  /**
   * Register a plugin.
   */
  use(newPlugin: Plugin, options: {queue: 'internal' | 'external'} = {queue: 'external'}): void {
    const plugins = this.plugins[options.queue]

    // Avoids applying same plugin twice, at least based on ref.
    if (plugins.indexOf(newPlugin) !== -1) {
      return
    }

    plugins.push(newPlugin)

    this.registry = [...this.plugins.external, ...this.plugins.internal].reduce(
      (registry: Registry, plugin: Plugin) => {
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
