# JSS plugin that gives you a better syntax than CSS

Can you remember what each of those values mean `box-shadow: 2px 2px 2px 1px gold;` and in which order they have to be used? Me neither. CSS values are sometimes cryptic. This plugin makes them easy to read and to remember.

Make sure you read [how to use
plugins](https://github.com/cssinjs/jss/blob/master/docs/setup.md#setup-with-plugins)
in general and [read full documentation](https://github.com/cssinjs/jss-expand/blob/master/docs/index.md).

[![Gitter](https://badges.gitter.im/JoinChat.svg)](https://gitter.im/cssinjs/lobby)

## Example

```javascript
const styles = {
  container: {
    padding: [20, 10],
    background: {
      color: 'green',
      image: 'url(image.jpg)',
      position: [0, 0],
      repeat: 'no-repeat'
    },
    boxShadow: {x: 10, y: 10, blur: 5, spread: 5, color: 'black'},
    transition: [
      {
        property: 'opacity',
        duration: '200ms'
      },
      {
        property: 'width',
        duration: '300ms'
      }
    ]
  }
}
```
Compiles to:

```css
.container-3kjh2 {
  padding: 20px 10px;
  background: green url(image.jpg) 0 0 no-repeat;
  box-shadow: 10px 10px 5px 5px black;
  transition: opacity 200ms, width 300ms;
}
```

## Features

1. Expanded object notation for all properties.

  ```javascript
  border: {
    width: '1px',
    style: 'solid',
    color: 'red'
  }
  ```

  will be converted to

  ```css
  border: 1px solid red;
  ```

1. Array notation for properties like `margin`, `padding` and others.

  ```javascript
  padding: [20, 10],
  borderRadius: ['50%', '10%']
  ```

1. Expanded arrays for multi value properties.

  ```javascript
  transition: [{
    property: 'opacity',
    duration: '200ms'
  }, {
    property: 'width',
    duration: '300ms'
  }]
  ```
  will be converted to

  ```css
  transition: opacity 200ms, width 300ms;
  ```

1. Default unit support.

  Now, using expanded arrays and objects syntax, you don't need to use quotes for the most numeric values! This is achieved in combination with [jss-default-unit](https://github.com/cssinjs/jss-default-unit) plugin.

## Issues

File a bug against [cssinjs/jss prefixed with \[jss-expand\]](https://github.com/cssinjs/jss/issues/new?title=[jss-expand]%20).

## Run tests

```bash
npm i
npm run test
```

## Run benchmark tests

```bash
npm i
npm run bench
```

## Licence

MIT
