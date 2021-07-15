## Pseudo and Nested Selectors

### Use `&` to reference selector of the parent rule

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
.container-0 {
  padding: 20px;
}
.container-0:hover {
  background: blue;
}
.container-0.clear {
  clear: both;
}
.container-0 .button {
  background: red;
}
.container-0.selected,
.container-0.active {
  border: 1px solid red;
}
```

### Use `$ruleName` to reference a local rule within the same style sheet

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
.button-1 {
  color: grey;
}
.container-0 .button-1 {
  padding: 10px;
}
.container-0:hover .button-1,
.container-0:active .button-1 {
  color: red;
}
.container-0:focus .button-1 {
  color: blue;
}
```

### Nest at-rules

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
.button-0 {
  color: red;
}
@media (min-width: 1024px) {
  .button-0 {
    width: 200px;
  }
}
```

### Deep nesting

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
.button-0.warn-1 {
  color: red;
}
.button-0.warn-1:hover,
.button-0.warn-1:focus {
  color: white;
  background: red;
}
```

## Increase specificity

When extending third party libraries with high secificity selector it's often necessary to also have a high specificity selector.

```javascript
const styles = {
  button: {
    '.button &': {
      color: 'red'
    }
  }
}
```

Compiles to:

```css
.button .button-0 {
  color: 'red';
}
```

### Demo

[CodeSandbox](//codesandbox.io/s/github/cssinjs/jss/tree/master/examples/plugins/jss-plugin-nested?fontsize=14)
