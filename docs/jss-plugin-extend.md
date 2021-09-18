## Extending styles

This plugin implements a custom property `extend` which allows you to mix in styles in various ways.

Style object own properties always take precedence over extended objects, so you can always override the extended definition. An exception is function values.

### Use style object reference

```javascript
const buttonColor = {
  color: 'green'
}
const buttonTheme = {
  extend: buttonColor,
  background: 'red'
}
const styles = {
  button: {
    extend: buttonTheme,
    fontSize: '20px'
  }
}
```

### Use rule name from the current styles object

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

### Use an array of style objects or rule names

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
  basePadding: {
    padding: '10px'
  },
  button: {
    extend: [background, color, 'basePadding'],
    fontSize: '20px'
  }
}
```

### Use function which returns a style object

Nested `extend` inside of the function is not supported. Will override other properties defined in the same rule.

```javascript
const styles = {
  button: {
    extend: (data) => ({
      color: data.theme.color
    }),
    fontSize: '20px'
  }
}
```

### Demo

[CodeSandbox](//codesandbox.io/s/github/cssinjs/jss/tree/master/examples/plugins/jss-plugin-extend?fontsize=14)
