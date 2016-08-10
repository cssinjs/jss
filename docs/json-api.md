## JSON API for declaring style sheets.

JSS is designed to stay as close as possible to the CSS syntax, however there are some exceptions.

### Regular Rule, without plugins

#### JS
```javascript
export default {
  button: {
    color: 'red',
    'font-size': '12px'
  }
}
```

#### CSS
```css
.button-jss-0 {
  color: red;
  font-size: 12px;
}
```

### Media Queries

#### JS

```javascript
export default {
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

#### ES6 with constants in prop names.

```javascript
const minWidth = 1024

export default {
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

#### CSS

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

### Keyframes Animation

#### JS

```javascript
export default {
  '@keyframes my-animation': {
    from: {opacity: 0},
    to: {opacity: 1}
  }
}
```

#### ES6 with constants in prop names.

Note, currently JSS doesn't fixes the keyframes identifier, which is global for the document in CSS, we can use a generated id though.

```javascript
const identifier = Math.random()
export default {
  [`@keyframes ${identifier}`]: {
    from: {opacity: 0},
    to {opacity: 1}
  }
}
```

#### CSS

```css
@keyframes my-animation {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Fallbacks

#### JS

```javascript
export default {
  container: {
    background: 'linear-gradient(to right, red 0%, green 100%)'
    fallbacks: {
      background: 'red'
    }
  }
}

// Or if you need multiple fallbacks for the same property name:
export default {
  container: {
    display: 'flex'
    fallbacks: [
      {display: 'box'},
      {display: 'flex-box'}
    ]
  }
}
```

#### CSS

```css
.container--jss-0-0 {
  background: red;
  background: linear-gradient(to right, red 0%, green 100%);
}
```

### Font Face

#### JS

```javascript
export default {
  '@font-face': {
    fontFamily: 'MyWebFont',
    src: 'url(webfont.eot)'
  }
}
```

#### CSS

```css
@font-face {
  font-family: 'MyWebFont';
  src: url('webfont.eot');
}
```

#### JS

```javascript
// Multiple font faces.
export default {
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

#### CSS

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

#### JS

```javascript
// Font-Face with src fallbacks.
export default {
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

#### CSS

```css
@font-face {
  font-family: 'MyWebFont';
  src: url('webfont.eot');
  src: url(webfont.eot?#iefix) format(embedded-opentype);
  src: url(webfont.woff2) format(woff2);
}
```

### Alternative syntax for space and comma separated values

In order to describe space or comma separated CSS values in a JavaScript way, we introduced an array based syntax.

There are some advantages in using this syntax:

1. Plugin `jss-default-unit` is able to set default unit effectively for numeric values.
2. You can use variables inside of a value declaration without string templates or concatenations.

#### JS

```javascript
export default {
  button: {
    // Comma separated value with regular CSS strings inside.
    border: [
      '1px solid red',
      '1px solid blue'
    ]
  }
}
```

#### CSS

```css
.button-12345 {
  border: 1px solid red, 1px solid blue;
}
```

#### JS

```javascript
export default {
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

#### CSS

```css
.button-12345 {
  border: 1px solid red, 1px solid blue;
}
```

#### JS

```javascript
export default {
  button: {
    // Space separated value.
    margin: [[5, 10]]
  }
}
```

#### CSS

```css
.button-12345 {
  margin: 5px 10px;
}
```

### Writing global selectors

When using option "named" `jss.createStyleSheet(styles, {named: false})` you can use keys as selectors instead of names. Be careful, now you will be writing a regular Style Sheet with global selectors.

#### JS

```javascript
export default {
  div: {
    boxSizing: 'border-box'
  }
}
```

#### CSS

```css
div {
  box-sizing: border-box;
}
```

### Pseudo and Nested Selectors.

Are supported through the [jss-nested](https://github.com/cssinjs/jss-nested) plugin.

### Property "content".

When assigning a string to the content property it requires double or single quotes in CSS. Therefore you also have to provide the quotes within the value string for content to match how it will be represented in CSS.

#### JS

```javascript
export default {
  button: {
    '&:after': {
      content: '"JSS"'
    }
  }
}
```

#### CSS

```css
.button-jss-0-1:after {
  content: "JSS"
}
```

### Working with colors

You can use any color conversion tool, for e.g. [this one](https://www.npmjs.com/package/color).

#### JS

```javascript
import color from 'color'

export default {
  button: {
    color: color('blue').darken(0.3).hexString()
  }
}
```

#### CSS

```css
.button-jss-0-1 {
  color: '#0000B3'
}
```

### Plugins

JSS plugins give you even more features, [read about them](./plugins.md).
