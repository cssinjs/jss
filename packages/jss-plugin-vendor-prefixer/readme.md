# JSS plugin that handles vendor prefixes in the browser

[![Gitter](https://badges.gitter.im/JoinChat.svg)](https://gitter.im/cssinjs/lobby)

This vendor prefixer knows which properties and values are supported in the
current runtime and changes only whats required.
The best thing is - you don't need to download all of them.
Also it is very fast, all checks are cached.

Make sure you read [how to use
plugins](https://github.com/cssinjs/jss/blob/master/docs/setup.md#setup-with-plugins)
in general.

## Example

```javascript
const styles = {
  container: {
    transform: 'translateX(100px)'
  }
}
```

Compiles to:

```css
.jss-0-0 {
  transform: -webkit-translateX(100px);
}
```

## Issues

File a bug against [cssinjs/jss prefixed with \[jss-vendor-prefixer\]](https://github.com/cssinjs/jss/issues/new?title=[jss-vendor-prefixer]%20).

## Run tests

```bash
npm i
npm run test
```

## License

MIT
