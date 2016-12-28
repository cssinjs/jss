# JSON API for declaring Style Sheets.

JSS is designed to stay as close as possible to the CSS syntax, however there are some exceptions.

## Regular Rule, without plugins

```javascript
const styles = {
  button: {
    color: 'red',
    'font-size': '12px'
  }
}
```

Compiles to:

```css
.button-jss-0 {
  color: red;
  font-size: 12px;
}
```

## Media Queries

```javascript
const styles = {
  button: {
    width: 100
  },
  '@media (min-width: 1024px)': {
    button: {
      width: 200
    }
  }
}
```

### ES6 with constants in prop names.

```javascript
const minWidth = 1024

const styles = {
  button: {
    width: 100
  },
  [`@media (min-width: ${minWidth}px)`]: {
    button: {
      width: 200
    }
  }
}
```

Compiles to:

```css
.button-jss-0 {
  width: 100px;
}
@media (min-width: 1024px): {
  .button-jss-0 {
    width: 200px;
  }
}
```

## Keyframes Animation

Note: keyframe id is still global and may conflict.

```javascript
const styles = {
  '@keyframes my-animation': {
    from: {opacity: 0},
    to: {opacity: 1}
  }
}
```

### ES6 with generated keyframe id

```javascript
const animationId = random()

const styles = {
  [`@keyframes ${animationId}`]: {
    from: {opacity: 0},
    to {opacity: 1}
  }
}
```

Compiles to:

```css
@keyframes my-animation {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## Fallbacks

```javascript
const styles = {
  container: {
    background: 'linear-gradient(to right, red 0%, green 100%)'
    fallbacks: {
      background: 'red'
    }
  }
}

// Or if you need multiple fallbacks for the same property name:
const styles = {
  container: {
    display: 'flex'
    fallbacks: [
      {display: 'box'},
      {display: 'flex-box'}
    ]
  }
}
```

Compiles to:

```css
.container--jss-0-0 {
  background: red;
  background: linear-gradient(to right, red 0%, green 100%);
}
```

## Font Face

```javascript
const styles = {
  '@font-face': {
    fontFamily: 'MyWebFont',
    src: 'url(webfont.eot)'
  }
}
```

Compiles to:

```css
@font-face {
  font-family: 'MyWebFont';
  src: url('webfont.eot');
}
```

```javascript
// Multiple font faces.
const styles = {
  '@font-face': [
    {
      fontFamily: 'MyWebFont',
      src: 'url(webfont.eot)'
    },
    {
      fontFamily: 'MySecondFont',
      src: 'url(webfont2.eot)'
    }
  ]
}
```

Compiles to:

```css
@font-face {
  font-family: 'MyWebFont';
  src: url('webfont.eot');
}
@font-face {
  font-family: 'MySecondFont';
  src: url('webfont2.eot');
}
```

```javascript
// Font-Face with src fallbacks.
const styles = {
  '@font-face': {
    fontFamily: 'MyWebFont',
    src: 'url(webfont.eot)',
    fallbacks: [
      {src: 'url(webfont.eot?#iefix) format(embedded-opentype)'},
      {src: 'url(webfont.woff2) format(woff2)'}
    ]
  }
}
```

Compiles to:

```css
@font-face {
  font-family: 'MyWebFont';
  src: url('webfont.eot');
  src: url(webfont.eot?#iefix) format(embedded-opentype);
  src: url(webfont.woff2) format(woff2);
}
```

## Alternative syntax for space and comma separated values

In order to describe space or comma separated CSS values in a JavaScript way, we introduced an array based syntax.

There are some advantages in using this syntax:

1. Plugin `jss-default-unit` is able to set default unit effectively for numeric values.
2. You can use variables inside of a value declaration without string templates or concatenations.

```javascript
const styles = {
  button: {
    // Comma separated value with regular CSS strings inside.
    border: [
      '1px solid red',
      '1px solid blue'
    ]
  }
}
```

Compiles to:

```css
.button-12345 {
  border: 1px solid red, 1px solid blue;
}
```

```javascript
const styles = {
  button: {
    // Comma separated value with space separated values inside.
    border: [
      // Numbers can become default unit automatically.
      [1, 'solid', 'red'],
      [1, 'solid', 'blue']
    ]
  }
}
```

Compiles to:

```css
.button-12345 {
  border: 1px solid red, 1px solid blue;
}
```

```javascript
const styles = {
  button: {
    // Space separated value.
    margin: [[5, 10]]
  }
}
```

Compiles to:

```css
.button-12345 {
  margin: 5px 10px;
}
```

## Writing global selectors

Global selectors can be used when [jss-global](https://github.com/cssinjs/jss-global) plugin is installed.

## Pseudo and Nested Selectors.

Are supported through the [jss-nested](https://github.com/cssinjs/jss-nested) plugin.

## Property "content".

When assigning a string to the content property it requires double or single quotes in CSS. Therefore you also have to provide the quotes within the value string for content to match how it will be represented in CSS.

```javascript
const styles = {
  button: {
    '&:after': {
      content: '"JSS"'
    }
  }
}
```

Compiles to:

```css
.button-jss-0-1:after {
  content: "JSS"
}
```

## Working with colors

You can use any color conversion tool, for e.g. [this one](https://www.npmjs.com/package/color).

```javascript
import color from 'color'

const styles = {
  button: {
    color: color('blue').darken(0.3).hexString()
  }
}
```

Compiles to:

```css
.button-jss-0-1 {
  color: '#0000B3'
}
```

## Plugins

JSS plugins give you even more features, [read about them](./plugins.md).
