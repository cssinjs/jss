## JSON API for declaring style sheets.

JSS is designed to stay as close as possible to the CSS syntax, however there are some exceptions.

### Multiple declarations with identical property names.

I recommend to not to use this if you use JSS on the client. Instead you should write a function, which makes a [vendor test](https://github.com/jsstyles/css-vendor) for this feature support and generates just one final declaration.

In case you are are precompiling JSS on the server, you might want to have more than one property with identical name, but different values:

```javascript
export default {
  container: {
    background: [
      'red',
      '-moz-linear-gradient(left, red 0%, green 100%)',
      '-webkit-linear-gradient(left, red 0%, green 100%)',
      '-o-linear-gradient(left, red 0%, green 100%)',
      '-ms-linear-gradient(left, red 0%, green 100%)',
      'linear-gradient(to right, red 0%, green 100%)'
    ]
  }
}
```

```css
.container--jss-0-0 {
  background: red;
  background: -moz-linear-gradient(left, red 0%, green 100%);
  background: -webkit-linear-gradient(left, red 0%, green 100%);
  background: -o-linear-gradient(left, red 0%, green 100%);
  background: -ms-linear-gradient(left, red 0%, green 100%);
  background: linear-gradient(to right, red 0%, green 100%);
}
```

### Using constants in prop names

Thanks to ES6 we can do it.

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
