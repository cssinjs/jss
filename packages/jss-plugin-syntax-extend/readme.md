# JSS plugin that enables mixing in styles

[![Gitter](https://badges.gitter.im/JoinChat.svg)](https://gitter.im/cssinjs/lobby)

This plugin implements a custom property `extend` which allows you to mix in styles in various ways.

Style object own properties always take precedence over extended objects, so you can always override the extended definition. Exception is function values.

## Use style object reference

```javascript
const buttonColor = {
  color: 'green'
}
const buttonTheme = {
  extend: buttonColor
  background: 'red'
}
const styles = {
  button: {
    extend: buttonTheme,
    fontSize: '20px'
  }
}
```

## Use rule name from the current styles object

```javascript
const styles = {
  buttonColor: {
    background: 'red'
  },
  button: {
    extend: 'buttonColor',
    fontSize: '20px'
  }
}
```

## Use array of style objects

```javascript
const styles = {
  button: {
    extend: [{background: 'red'}, {color: 'green'}],
    fontSize: '20px'
  }
}
```

```javascript
const background = {background: 'red'}
const color = {color: 'green'}

const styles = {
  button: {
    extend: [background, color],
    fontSize: '20px'
  }
}
```

## Use function which returns a style object

Nested `extend` inside of the function is not supported. Will override other properties defined in the same rule.

```javascript
const styles = {
  button: {
    extend: data => ({
      color: data.theme.color
    }),
    fontSize: '20px'
  }
}
```

## Demo

[Simple demo](http://cssinjs.github.io/examples/plugins/jss-extend/simple/)

[Multi objects demo](http://cssinjs.github.io/examples/plugins/jss-extend/multi/)

## Issues

File a bug against [cssinjs/jss prefixed with \[jss-extend\]](https://github.com/cssinjs/jss/issues/new?title=[jss-extend]%20).

## Run tests

```bash
yarn
yarn test
```

## License

MIT
