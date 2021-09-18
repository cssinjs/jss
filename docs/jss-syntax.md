# Objects based styles syntax for declaring Style Sheets

JSS is designed to stay as close as possible to the CSS syntax. However, there are some exceptions. JSS uses a plugin-based architecture, so plugins add some of the syntaxes from the core package and others by optional plugins, which you can [setup](./setup.md).

## Basic syntax

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
.button-0 {
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

### ES6 with constants in prop names

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
.button-0 {
  width: 100px;
}
@media (min-width: 1024px) : {
  .button-0 {
    width: 200px;
  }
}
```

## Keyframes Animation

Keyframes name will use the same id generator function as the class names. Animation name gets scoped by default. To access it within the same style sheet, you can use `$ref` syntax as a value of `animationName` or `animation` property.

Additionally, you can access generated name through `sheet.keyframes.{name}` map.

To generate a global animation name, you can use `@global` rule.

```javascript
const styles = {
  '@keyframes slideRight': {
    from: {opacity: 0},
    to: {opacity: 1}
  },
  container: {
    animationName: '$slideRight'
  }
}
```

Compiles to:

```css
@keyframes keyframes-slideRight-0 {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.container-1 {
  animation-name: keyframes-slideRight-0;
}
```

## Fallbacks

```javascript
const styles = {
  container: {
    background: 'linear-gradient(to right, red 0%, green 100%)',
    fallbacks: {
      background: 'red'
    }
  }
}
```

Or if you need multiple fallbacks for the same property name:

```js
const styles = {
  container: {
    display: 'flex',
    fallbacks: [{display: 'box'}, {display: 'flex-box'}]
  }
}
```

Compiles to:

```css
.container-0 {
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

## Basic at rules

```javascript
const styles = {
  '@charset': '"utf-8"',
  '@import': 'url(http://mysite.com/custom.css)',
  '@namespace': 'url(http://mysite.com/xhtml)'
}
```

Compiles to:

```css
@charset "utf-8";
@import url(http://mysite.com/custom.css);
@namespace url(http://mysite.com/xhtml);
```

## Alternative syntax for space and comma separated values

To describe space or comma separated CSS values in a JavaScript way, we introduced an array based syntax.

There are some advantages to using this syntax:

1.  Plugin `jss-plugin-default-unit` is able to set default unit effectively for numeric values.
2.  You can use variables inside of a value declaration without string templates or concatenations.

### Comma separated values

```javascript
const styles = {
  button: {
    // Comma separated value with regular CSS strings inside.
    background: ['url(image1.png)', 'url(image2.png)']
  }
}
```

Compiles to:

```css
.button-0 {
  background: url(image1.png), url(image2.png);
}
```

```javascript
const styles = {
  button: {
    // Comma separated value with space separated values inside.
    background: [
      // Numbers can become default unit automatically.
      ['url(image1.png)', 'no-repeat', 'top'],
      ['url(image1.png)', 'no-repeat', 'right']
    ]
  }
}
```

Compiles to:

```css
.button-0 {
  background: url(image1.png) no-repeat top, url(image1.png) no-repeat right;
}
```

### Space separated values

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
.button-0 {
  margin: 5px 10px;
}
```

### Modifier "!important"

```javascript
const styles = {
  button: {
    color: [['red'], '!important'],
    margin: [[5, 10], '!important']
  }
}
```

Compiles to:

```css
.button-0 {
  color: red !important;
  margin: 5px 10px !important;
}
```

## Property "content"

When assigning a string to the content property, it requires double or single quotes in CSS. Therefore you also have to provide the quotes within the value string for content to match how it will get represented in CSS.

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
.button-0:after {
  content: 'JSS';
}
```

## Working with colors

You can use any color conversion tool, e.g. [this one](https://yarnpkg.com/en/package/color).

```javascript
import color from 'color'

const styles = {
  button: {
    color: color('blue').darken(0.3).hex()
  }
}
```

Compiles to:

```css
.button-0 {
  color: '#0000B3';
}
```

## Typed CSSOM

JSS supports Typed CSSOM (Houdini) values. You can learn more about them [here](https://developers.google.com/web/updates/2018/03/cssom) and track the standardization progress [here](https://ishoudinireadyyet.com/). Also, make sure you use a [polyfill](https://github.com/csstools/css-typed-om) for browsers without support. It will make the most sense when used together with function values and observables for frequent updates.

```javascript
const styles = {
  button: {
    margin: CSS.px(10)
  }
}
```

[Here is an example](https://codesandbox.io/s/houdini-typed-value-jmec9) that makes use of typed values API to update a value and avoid CSS parsing.
