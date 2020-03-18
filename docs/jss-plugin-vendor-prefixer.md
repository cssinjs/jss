## Add vendor prefixes in the browser

This vendor prefixer knows which properties and values are supported in the current runtime and changes only what's required. The best thing is - you don't need to download all of them. Also, it is fast, because all checks are cached.

### Example

```javascript
const styles = {
  container: {
    transform: 'translateX(100px)'
  }
}
```

Compiles to:

```css
.container-0 {
  transform: -webkit-translateX(100px);
}
```

### Demo

[CodeSandbox](//codesandbox.io/s/github/cssinjs/jss/tree/master/examples/plugins/jss-plugin-vendor-prefixer?fontsize=14)
