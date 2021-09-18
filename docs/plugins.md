# JSS Plugins

Plugins API allows modifying style sheets at different stages. A plugin can, for example, add new style properties, modify values or add new rules.

## Order does matter

Plugins application happens in the same order as they are registered.
In case you use any of the following plugins please bear in mind that they should be registered in this order:

1. [jss-plugin-rule-value-function](https://yarnpkg.com/en/package/jss-plugin-rule-value-function) - enables functions for dynamic styles.
1. [jss-plugin-rule-value-observable](https://yarnpkg.com/en/package/jss-plugin-rule-value-observable) - enables TC39 Observables.
1. [jss-plugin-template](https://yarnpkg.com/en/package/jss-plugin-template) - enables string templates.
1. [jss-plugin-cache](https://yarnpkg.com/en/package/jss-plugin-cache) - caches the rules by reference for performance.
1. [jss-plugin-global](https://yarnpkg.com/en/package/jss-plugin-global) - enables global styles.
1. [jss-plugin-extend](https://yarnpkg.com/en/package/jss-plugin-extend) - enables extending rules at compile time.
1. [jss-plugin-nested](https://yarnpkg.com/en/package/jss-plugin-nested) - enables nesting selectors and pseudo selectors.
1. [jss-plugin-compose](https://yarnpkg.com/en/package/jss-plugin-compose) - enables composing classes.
1. [jss-plugin-camel-case](https://yarnpkg.com/en/package/jss-plugin-camel-case) - enables camel case syntax for properties.
1. [jss-plugin-default-unit](https://yarnpkg.com/en/package/jss-plugin-default-unit) - adds default units to numeric values.
1. [jss-plugin-expand](https://yarnpkg.com/en/package/jss-plugin-expand) - enables better syntax for complex properties and values.
1. [jss-plugin-vendor-prefixer](https://yarnpkg.com/en/package/jss-plugin-vendor-prefixer) - adds vendor prefixes in the browser runtime (not for SSR).
1. [jss-plugin-props-sort](https://yarnpkg.com/en/package/jss-plugin-props-sort) - ensures alphabetical props order.
1. [jss-plugin-isolate](https://yarnpkg.com/en/package/jss-plugin-isolate) - enables rules isolation through automatic properties reset.

[jss-preset-default](https://yarnpkg.com/en/package/jss-preset-default) a preset that allows you to set up a predefined list of most useful plugins with one function call.

## Authoring plugins

`jss.use(plugin)`

You need to register a `plugin` only once per JSS instance. There are some hooks available. The same plugin may implement multiple hooks.

1.  Hook `onCreateRule(name, decl, options)`.

    Invocation happens when a rule is about to be created. If this object returns an object, it is supposed to be a rule instance. If the returned value is empty, JSS will fall back to a regular rule.

    ```javascript
    import jss from 'jss'

    jss.use({
      onCreateRule: (name, decl, options) => null
    })
    ```

1.  Hook `onProcessRule(rule, sheet)`.

    Invocation happens when rule instance is available with the rule as an argument.

    ```javascript
    import jss from 'jss'

    jss.use({
      onProcessRule: (rule, sheet) => {
        // Do something here.
      }
    })
    ```

1.  Hook `onProcessStyle(style, rule, sheet)`.

    Invocation happens after creation and processing of the rule instance. It should be used to make `style` object transformations. For performance reasons, you are allowed to mutate the `style` object itself, though **NOT** the nested objects. It is limited to the first level because the `style` object is shallow-cloned in the core, but the nested objects have to be cloned by plugins if they need to mutate it. Use `jss.cloneStyle()` utility to clone style object. The returned object from the hook will replace `rule.style`.

    ```javascript
    import jss from 'jss'

    jss.use({
      onProcessStyle: (style, rule, sheet) => style
    })
    ```

1.  Hook `onProcessSheet(sheet)`.

    This hook is invoked on every created `StyleSheet` after all rules are processed, with the `sheet` as an argument.

    ```javascript
    import jss from 'jss'

    jss.use({
      onProcessSheet: (sheet) => {
        // Do something here.
      }
    })
    ```

1.  Hook `onChangeValue(value, prop, rule)`.

    Invocation happens after `rule.prop(prop, value)` is called as a setter (with a value). Method `sheet.update()` uses `rule.prop()` internally. The returned value will be set on the style object and the CSSOM CSSRule object if the sheet is linked. If multiple plugins implement this hook, return value from the first one will be passed to the second one and so on, like a chain of `map` functions.

    ```javascript
    import jss from 'jss'

    jss.use({
      onChangeValue: (value, prop, rule) => value
    })
    ```

1.  Hook `onUpdate(data, rule, sheet)`.

    This hook is invoked on every created rule when `sheet.update(data)` is called, with the passed data as an argument. It allows you to transform style object after every update of dynamic values or dynamic style objects.

    ```javascript
    import jss from 'jss'

    jss.use({
      onUpdate: (data, rule, sheet) => {
        // Do something here.
      }
    })
    ```
