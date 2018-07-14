# JSS plugin enables string templates

[![Gitter](https://badges.gitter.im/JoinChat.svg)](https://gitter.im/cssinjs/lobby)

Make sure you read [how to use
plugins](https://github.com/cssinjs/jss/blob/master/docs/setup.md#setup-with-plugins)
in general.

This plugin allows you to use string templates to declare CSS rules. It implements a **very naive** but **very fast (~42000 ops/sec)** runtime CSS parser, with certain limitations:

- Supports only rule body (no selectors)
- Requires semicolon and new line after the value (except of last line)
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

## Issues

File a bug against [cssinjs/jss prefixed with \[jss-template\]](https://github.com/cssinjs/jss/issues/new?title=[jss-template]%20).

## Run tests

```bash
npm i
npm run test
```

## License

MIT
