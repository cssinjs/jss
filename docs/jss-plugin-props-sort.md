## Ensures style properties extend each other instead of overriding

Inspired by React Native. When using this plugin, more specific properties will not be overwritten by less specific.

```javascript
const styles = {
  container: {
    'border-left': '1px solid red',
    border: '3px solid green'
  }
}
```

Compiles to:

```css
.container-0 {
  border: 3px solid green;
  border-left: 1px solid red;
}
```

### Demo

[CodeSandbox](//codesandbox.io/s/github/cssinjs/jss/tree/master/examples/plugins/jss-plugin-props-sort?fontsize=14)
