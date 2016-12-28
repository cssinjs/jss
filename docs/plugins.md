# JSS Plugins

Plugins API allows to modify sheets and rules at different stages. A plugin can for e.g. add new style properties, modify values or even add new rules.

A number of [plugins](https://github.com/cssinjs?q=plugin) do exist already. We are happy to add more.

## Order does matter

The order in which plugins are registered matters since they will be applied sequentially.

In case you use any of the following plugins please bear in mind that they should be registered in this order:

  1. jss-cache
  1. jss-global
  1. jss-extend
  1. jss-nested
  1. jss-compose
  1. jss-camel-case
  1. jss-default-unit
  1. jss-expand
  1. jss-vendor-prefixer
  1. jss-props-sort
  1. jss-isolate

To make your life easier we made [jss-default-preset](https://www.npmjs.com/package/jss-preset-default) which is a ready to use and ordered preset of plugins.

## Authoring plugins.

`jss.use(plugin)`

You need to register a `plugin` only once per JSS instance. There is a number of hooks available. Multiple hooks may be implemented by the same plugin.

1. Hook `onCreateRule(name, decl, options)`.

  This hook is invoked when a rule is about to be created. If this object returns an object, it is supposed to be a rule instance. If empty value is returned, JSS will fall back to a regular rule.

  ```javascript
  jss.use({
    onCreateRule: (name, decl, options) => {
      // Do something here.
    }
  })
  ```

1. Hook `onProcessRule(rule, sheet)`.

  This hook is invoked on every created rule with the rule as an argument. If a `plugin` is a function, then jss defaults it to `onProcessRule` hook.

  ```javascript
  jss.use((rule) => {
    // Do something here.
  })

  // or

  jss.use({
    onProcessRule: (rule, sheet) => {
      // Do something here.
    }
  })
  ```

