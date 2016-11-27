## JSS Plugins.

The Plugins API allows to manipulate every rule at creation time. A plugin can for e.g. add new style properties, modify values or even add new rules.

A number of [plugins](https://github.com/cssinjs?query=jss-) do exist already. We are happy to add more.

### Order does matter

The order in which plugins are registered matters since they will be applied sequentially.

In case you use any of the following plugins please bear in mind that they should be registered in this order:

  1. jss-extend
  1. jss-nested
  1. jss-camel-case
  1. jss-default-unit
  1. jss-expand
  1. jss-vendor-prefixer
  1. jss-props-sort
  1. jss-compose
  1. jss-isolate

To make your life easier we made [jss-default-preset](https://www.npmjs.com/package/jss-preset-default) which is a ready to use and ordered preset of plugins.

### Authoring plugins.

You need to register a plugin only once per JSS instance and it will be applied to every rule.

`jss.use(fn)`

Passed function will be invoked with a Rule instance as an argument.

```javascript
// Using a global JSS instance.
import jss from 'jss'
jss.use(function(rule) {
  // Your modifier.
})

// Using a local JSS instance.
import {create} from 'jss'
const jss = create()
jss.use(function(rule) {
  // Your modifier.
})
```
