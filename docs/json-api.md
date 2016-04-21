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

### Font Face

```javascript
export default {
  '@font-face': {
    fontFamily: 'MyWebFont',
    src: [
      'url(webfont.eot)',
      'url(webfont.eot?#iefix) format(embedded-opentype)',
      'url(webfont.woff2) format(woff2)'
    ]
  }
}
```

#### CSS

```css
@font-face {
  font-family: 'MyWebFont';
  src: url('webfont.eot');
  src: url('webfont.eot?#iefix') format('embedded-opentype');
  src: url('webfont.woff2') format('woff2');
}       
```

### Fallbacks

JavaScript Objects can't have identical property names, but we can use arrays. This is even more concise.

```javascript
export default {
  container: {
    background: [
      'red',
      'linear-gradient(to right, red 0%, green 100%)'
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
### Writing global selectors

When using option "named" `jss.createStyleSheet(styles, {named: false})` you can use keys as selectors instead of names. Be careful, now you will be writing a regular Style Sheet with global selectors.

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

Are supported through the [jss-nested](https://github.com/jsstyles/jss-nested) plugin.

### Plugins

JSS plugins give you even more features, [read about them](./plugins.md).
