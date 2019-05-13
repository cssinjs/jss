## Enables string templates

This parser is not meant to be a complete one but to enable authoring styles using a template string with nesting syntax support, fastest parse performance and small footprint.

Design of this parser has two main principles:

1. It does not parse entire CSS. It uses only specific markers to separate selectors from props and values.
1. It uses warnings to make sure expected syntax is used instead of supporting the full syntax.

To do that it requires some constraints:

- Parser expects a new line after each declaration (`color: red;\n`).
- Parser expects an ampersand, selector and opening curly brace for nesting syntax on a single line (`& selector {`).
- Parser expects a closing curly brace on a separate line.

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

### Benchmark

```
Chrome 74.0.3729 (Mac OS X 10.14.3)  Parse: parse() at 117245 ops/sec
Chrome 74.0.3729 (Mac OS X 10.14.3)  Parse: stylis() at 46939 ops/sec
Chrome 74.0.3729 (Mac OS X 10.14.3)
  Parse: parse() at 117245 ops/sec (2.50x faster than stylis())
```
