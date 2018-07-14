# JSS plugin that ensures style properties extend each other instead of override

[![Gitter](https://badges.gitter.im/JoinChat.svg)](https://gitter.im/cssinjs/lobby)

Inspired by React Native. When using this plugin,
more specific properties will not be overwritten by less specific.

## Usage example

```javascript
const styles = {
  container: {
    'border-left': '1px solid red',
    border: '3px solid green'
  }
})
```

Compiles to:

```css
.jss-jkh4234 {
  border: 3px solid green;
  border-left: 1px solid red;
}
```

## Demo

[Simple](http://cssinjs.github.io/examples/plugins/jss-props-sort/simple/index.html)

## Run tests

```bash
npm i
npm run test
```

## License

MIT
