# JSS Plugins

Plugins API allows to modify sheets and rules at different stages. A plugin can for e.g. add new style properties, modify values or even add new rules.

A number of [plugins](https://github.com/cssinjs?q=plugin) do exist already. We are happy to add more.

## Order does matter

The order in which plugins are registered matters since they will be applied sequentially.

In case you use any of the following plugins please bear in mind that they should be registered in this order:

1.  jss-plugin-template - JSS plugin enables string templates
1.  jss-plugin-cache - JSS plugin that caches the rules and delivers insane performance.
1.  jss-plugin-global - JSS plugin, allows global styles.
1.  jss-plugin-extend - JSS plugin, allows to extend rules at compile time.
1.  jss-plugin-nested - JSS plugin, allows nested selectors and pseudo selectors.
1.  jss-plugin-compose - JSS plugin, allows classes composition.
1.  jss-plugin-camel-case - JSS plugin, allows to write styles in camel case.
1.  jss-plugin-default-unit - JSS plugin, adds default units to numeric values.
1.  jss-plugin-expand - JSS plugin, gives you a better syntax than CSS itself.
1.  jss-plugin-vendor-prefixer - JSS plugin, adds vendor prefixes at runtime, in the browser (not for SSR)
1.  jss-plugin-props-sort - JSS plugin, ensures alphabetical props order.
1.  jss-plugin-isolate - JSS plugin, gives you rules isolation through automatic properties reset.

To make your life easier, we made [jss-default-preset](https://yarnpkg.com/en/package/jss-preset-default) which is a ready to use and ordered preset of plugins.

## Authoring plugins

`jss.use(plugin)`

You need to register a `plugin` only once per JSS instance. There is a number of hooks available. Multiple hooks may be implemented by the same plugin.

1.  Hook `onCreateRule(name, decl, options)`.

    This hook is invoked when a rule is about to be created. If this object returns an object, it is supposed to be a rule instance. If an empty value is returned, JSS will fall back to a regular rule.

    ```javascript
    import jss from 'jss'

    jss.use({
      onCreateRule: (name, decl, options) => null
    })
    ```

1.  Hook `onProcessRule(rule, sheet)`.

    This hook is invoked on every created rule with the rule as an argument.

    ```javascript
    import jss from 'jss'

    jss.use({
      onProcessRule: (rule, sheet) => {
        // Do something here.
      }
    })
    ```

1.  Hook `onProcessStyle(style, rule, sheet)`.

    This hook is invoked on every created rule with `style` as a primary argument. It is designed for `style` object transformations and rule manipulations. For performance reasons, you are allowed to mutate the `style` object itself, though **NOT** the nested objects. It is limited to the first level because the `style` object is shallow-cloned in the core, but the nested objects have to be cloned by plugins if they need to mutate it. Use `jss.cloneStyle()` utility for style cloning. The returned object from the hook will replace `rule.style`.

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
      onProcessSheet: sheet => {
        // Do something here.
      }
    })
    ```

1.  Hook `onChangeValue(value, prop, rule)`.

    This hook is invoked when `rule.prop(prop, value)` is called as a setter (with a value). Method `sheet.update()` uses `rule.prop()` internally. If this hook is implemented by a plugin, the returned value will be set on the style object and on the CSSOM CSSRule object if the sheet is linked. If multiple plugins implement this hook, return value from the first one will be passed to the second one and so on, like a chain of `map` functions.

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
