# JSS plugin enables support for nested rules

[![Gitter](https://badges.gitter.im/JoinChat.svg)](https://gitter.im/cssinjs/lobby)

Make sure you read [how to use
plugins](https://github.com/cssinjs/jss/blob/master/docs/setup.md#setup-with-plugins)
in general.

## Use `&` to reference selector of the parent rule.

```javascript
const styles = {
  container: {
    padding: 20,
    '&:hover': {
      background: 'blue'
    },
    // Add a global .clear class to the container.
    '&.clear': {
      clear: 'both'
    },
    // Reference a global .button scoped to the container.
    '& .button': {
      background: 'red'
    },
    // Use multiple container refs in one selector
    '&.selected, &.active': {
      border: '1px solid red'
    }
  }
}
```

Compiles to:

```css
.container-3775999496 {
  padding: 20px;
}
.container-3775999496:hover {
  background: blue;
}
.container-3775999496.clear {
  clear: both;
}
.container-3775999496 .button {
  background: red;
}
.container-3775999496.selected,
.container-3775999496.active {
  border: 1px solid red;
}
```

## Use `$ruleName` to reference a local rule within the same style sheet.

```javascript
const styles = {
  container: {
    // Reference the local rule "button".
    '& $button': {
      padding: '10px'
    },
    // Multiple local refs in one rule.
    '&:hover $button, &:active $button': {
      color: 'red'
    },
    '&:focus $button': {
      color: 'blue'
    }
  },
  button: {
    color: 'grey'
  }
}
```

Compiles to:

```css
.button-3940538223 {
  color: grey;
}
.container-2645419599 .button-3940538223 {
  padding: 10px;
}
.container-2645419599:hover .button-3940538223,
.container-2645419599:active .button-3940538223 {
  color: red;
}
.container-2645419599:focus .button-3940538223 {
  color: blue;
}
```

## Use at-rules inside of regular rules.

```javascript
const styles = {
  button: {
    color: 'red',
    '@media (min-width: 1024px)': {
      width: 200
    }
  }
}
```

Compiles to:

```css
.button-2683044438 {
  color: red;
}
@media (min-width: 1024px) {
  .button-2683044438 {
    width: 200px;
  }
}
```

## Deep nesting

```javascript
const styles = {
  button: {
    '&$warn': {
      color: 'red',
      '&:hover, &:focus': {
        color: 'white',
        background: 'red'
      }
    }
  },
  warn: {}
}
```

Compiles to:

```css
.button-274964227.warn-2315792072 {
  color: red;
}
.button-274964227.warn-2315792072:hover,
.button-274964227.warn-2315792072:focus {
  color: white;
  background: red;
}
```

## Demo

[Simple](http://cssinjs.github.io/examples/plugins/jss-nested/simple/index.html)

## Issues

File a bug against [cssinjs/jss prefixed with \[jss-nested\]](https://github.com/cssinjs/jss/issues/new?title=[jss-nested]%20).

## Run tests

```bash

yarn
yarn test
```

## License

MIT
