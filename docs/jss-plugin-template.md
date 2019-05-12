## Enables string templates

Allows you to use string templates to declare CSS rules. It implements a **simplified** but **very fast** runtime CSS parser, with certain limitations:

- Requires new lines at the end of each declaration.
- Requires a closing curly brace of a nested rule to be on a separate line.

```js
const styles = {
  button: `
    border-radius: 3px;
    background-color: green;
    color: red;
    margin: 20px 40px;
    padding: 10px;
    &:hover span {
      color: green;
    }
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
