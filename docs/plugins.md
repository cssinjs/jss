## JSS Plugins.

Plugins API allows to modify sheets and rules at different stages. A plugin can for e.g. add new style properties, modify values or even add new rules.

A number of [plugins](https://github.com/cssinjs?query=jss-) do exist already. We are happy to add more.

### Order does matter

  1. jss-extend
  1. jss-nested
  1. jss-camel-case
  1. jss-default-unit
  1. jss-expand
  1. jss-vendor-prefixer
  1. jss-props-sort
  1. jss-compose
  1. jss-isolate

### Authoring plugins.

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

1. Hook `onProcessRule(rule)`.

  This hook is invoked on every created rule with the rule as an argument. If a `plugin` is a function, then jss defaults it to `onProcessRule` hook.

  ```javascript
  jss.use((rule) => {
    // Do something here.
  })

  // or

  jss.use({
    onProcessRule: (rule) => {
      // Do something here.
    }
  })
  ```

