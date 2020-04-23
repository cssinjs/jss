## Enables string templates

Allows you to use string templates to declare CSS rules. It implements a **very naive** but **very fast (~42000 ops/sec)** runtime CSS parser, with certain limitations:

- Supports only rule body (no selectors)
- Requires semicolon and a new line after the value (except the last line)
- No nested rules support

```js
const styles = {
  button: `
    border-radius: 3px;
    background-color: green;
    color: red;
    margin: 20px 40px;
    padding: 10px;
  `,
  '@media print': {
    button: `color: black`
  },
  '@keyframes id': {
    from: `opacity: 0`,
    to: `opacity: 1`
  }
}
```

### Demo

[CodeSandbox](//codesandbox.io/s/github/cssinjs/jss/tree/master/examples/plugins/jss-plugin-template?fontsize=14)
