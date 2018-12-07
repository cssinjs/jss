# JSON API for declaring Style Sheets

JSS is designed to stay as close as possible to the CSS syntax, however there are some exceptions. JSS uses a plugins based architecture, so some of the syntax is added by plugins from the core package and some are added by optional plugins, which you can [setup](./setup.md).

## Basic syntax

**Package: [jss](https://github.com/cssinjs/jss/tree/docs/packages/jss)**

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

## Camel case syntax

**Package: [jss-plugin-syntax-camel-case](https://github.com/cssinjs/jss/tree/docs/packages/jss-plugin-syntax-camel-case)**

Once plugin is used, we can write CSS properties in camel case syntax.

```javascript
const styles = {
  button: {
    color: 'red',
    fontSize: '12px'
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

## Global selectors

**Package: [jss-plugin-syntax-global](https://github.com/cssinjs/jss/tree/docs/packages/jss-plugin-syntax-global)**

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

## Default units

**Package: [jss-plugin-syntax-default-unit](https://github.com/cssinjs/jss/tree/docs/packages/jss-plugin-syntax-default-unit)**

Provide numeric values in your style definitions, and the plugin will insert the corresponding units. Defaults to px for sizes, ms for durations, and % for transform origins, and these can be customized.

```javascript
const styles = {
  button: {
    'line-height': 3,
    'font-size': 1.7,
    height: 200,
    'z-index': 1
  }
}
```

Compiles to:

```css
.button-0 {
  line-height: 3;
  font-size: 1.7px;
  height: 200px;
  z-index: 1;
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

Keyframes name will use the same id generator function as the class names. Animation name will be scoped by default. In order to access it within the same style sheet, you can use `$ref` syntax as a value of `animationName` or `animation` property.

Additionally generated name can be accessed through `sheet.keyframes.{name}` map.

In order to generate a global animation name, you can use `@global` rule.

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

## Alternative syntax for space and comma separated values

In order to describe space or comma separated CSS values in a JavaScript way, we introduced an array based syntax.

There are some advantages in using this syntax:

1.  Plugin `jss-plugin-syntax-default-unit` is able to set default unit effectively for numeric values.
2.  You can use variables inside of a value declaration without string templates or concatenations.

### Comma separated values

```javascript
const styles = {
  button: {
    // Comma separated value with regular CSS strings inside.
    border: ['1px solid red', '1px solid blue']
  }
}
```

Compiles to:

```css
.button-0 {
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
.button-0 {
  border: 1px solid red, 1px solid blue;
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

## Writing global selectors

Global selectors can be used when the [jss-plugin-syntax-global](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-syntax-global) plugin is installed.

## Pseudo and Nested Selectors

Are supported through the [jss-plugin-syntax-nested](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-syntax-nested) plugin.

## Property "content"

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
.button-0:after {
  content: 'JSS';
}
```

## Working with colors

You can use any color conversion tool, for e.g. [this one](https://yarnpkg.com/en/package/color).

```javascript
import color from 'color'

const styles = {
  button: {
    color: color('blue')
      .darken(0.3)
      .hex()
  }
}
```

Compiles to:

```css
.button-0 {
  color: '#0000B3';
}
```

## Typed CSSOM (Houdini)

Typed CSSOM values are supported. You can learn more about them [here](https://developers.google.com/web/updates/2018/03/cssom) and track the standardization progress [here](https://ishoudinireadyyet.com/). Also make sure you use a [polyfill](https://github.com/csstools/css-typed-om) for browsers without support. It will make most sence when used together with function values and observables for frequent updates.

```javascript
const styles = {
  button: {
    margin: CSS.px(10)
  }
}
```

## Plugins

JSS plugins give you even more features, [read about them](plugins.md).
