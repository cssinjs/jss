## Global selectors

Selectors have a generated (scoped) suffix by default to avoid conflicts. You can use this plugin to generate a global selector.

### Top level global declarations block

```javascript
const styles = {
  '@global': {
    body: {
      color: 'green'
    },
    a: {
      textDecoration: 'underline'
    }
  }
}
```

Compiles to:

```css
body {
  color: green;
}
a {
  text-decoration: underline;
}
```

### Nested global declarations block

```javascript
const styles = {
  button: {
    float: 'left',
    '@global': {
      span: {color: 'red'}
    }
  }
}
```

Compiles to:

```css
.button-0 {
  float: left;
}
.button-0 span {
  color: red;
}
```

### Nested global prefix

```javascript
const styles = {
  button: {
    float: 'left',
    '@global span': {color: 'red'}
  }
}
```

Compiles to:

```css
.button-0 {
  float: left;
}
.button-0 span {
  color: red;
}
```

### Demo

[CodeSandbox](//codesandbox.io/s/github/cssinjs/jss/tree/master/examples/plugins/jss-plugin-global?fontsize=14)
