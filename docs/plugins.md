## JSS Plugins.

Plugins API allows to modify every rule at creation time. A plugin can for e.g. add new style properties, modify values or even add new rules.

A number of [plugins](https://github.com/cssinjs?query=jss-) do exist already. We are happy to add more.

### Order does matter

  1. jss-extend
  1. jss-nested
  1. jss-camel-case
  1. jss-default-unit
  1. jss-vendor-prefixer
  1. jss-props-sort
  1. jss-compose 
  1. jss-isolate 

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
