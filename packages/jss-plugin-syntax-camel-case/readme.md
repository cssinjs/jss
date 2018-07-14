# JSS plugin that allows to write camel cased rule properties

[![Gitter](https://badges.gitter.im/JoinChat.svg)](https://gitter.im/cssinjs/lobby)

Internally it converts everything back to dash separated names.

Make sure you read [how to use
plugins](https://github.com/cssinjs/jss/blob/master/docs/setup.md#setup-with-plugins)
in general.

## Example

```javascript
const styles = {
  container: {
    fontSize: '20px',
    zIndex: 1,
    lineHeight: 1.2
  }
}
```

```css
.container-a24234 {
  font-size: 20px;
  z-index: 1;
  line-height: 1.2;
}
```

## Demo

[Simple](http://cssinjs.github.io/examples/plugins/jss-camel-case/simple/index.html)

## Issues

File a bug against [cssinjs/jss prefixed with \[jss-camel-case\]](https://github.com/cssinjs/jss/issues/new?title=[jss-camel-case]%20).

## Run tests

```bash
npm i
npm run test
```

## License

MIT
