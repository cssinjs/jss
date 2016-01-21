## JSS Plugins.

JSS styles are just plain JavaScript objects. They map 1:1 to css rules, except of those modified by [plugins](https://github.com/jsstyles?query=jss-).

Some of those plugins:

- Nested rules is implemented through [jss-nested](https://github.com/jsstyles/jss-nested) plugin. Also you can do pseudo selectors like `:hover` via nested rules.
- Use `extend` property to inherit from some plain rule object, via [jss-extend](https://github.com/jsstyles/jss-extend)
- Vendor prefixes are automatically added through [jss-vendor-prefixer](https://github.com/jsstyles/jss-vendor-prefixer) plugin.
- You can use camel cased css property names through [jss-camel-case](https://github.com/jsstyles/jss-camel-case) plugin.
- Add unit automatically to non numeric values using [jss-default-unit](https://github.com/jsstyles/jss-default-unit)

#### Order does matter! Here is the right one:

  1. jss-extend
  1. jss-nested
  1. jss-camel-case
  1. jss-default-unit
  1. jss-vendor-prefixer
  1. jss-props-sort

#### Authoring plugins is easy.

Register plugin.

`jss.use(fn)`

Passed function will be invoked with Rule instance. Take a look at [plugins](https://github.com/jsstyles?query=jss-) like `extend`, `nested` or `vendorPrefixer`.

```javascript
jss.use(function(rule) {
  // Your modifier.
})
```
