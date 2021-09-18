## Enables classes composition

This plugin allows you to use CSS frameworks and legacy code together with JSS as well as reuse Rules more granularly.

### Compose with global classes.

To combine JSS with CSS framework like [Material Design Lite](https://getmdl.io/) or [Bootstrap](http://getbootstrap.com/) and others.

```javascript
const styles = {
  button: {
    // Using space separated class names.
    composes: 'btn btn-primary',
    color: 'red'
  },
  buttonActive: {
    // Using an array of class names.
    composes: ['btn', 'btn-primary'],
    color: 'blue'
  }
}
```

Compiles to:

```css
.button-123456 {
  color: red;
}
.buttonActive-123456 {
  color: blue;
}
```

When you use it:

```javascript
import React from 'react'

const classes = {
  button: 'button-123456 btn',
  buttonActive: 'buttonActive-123456 btn btn-primary'
}

const button1 = <button className={classes.button}>Button</button>
const button2 = <button className={classes.buttonActive}>Active Button</button>
```

It renders to:

```html
<button class="button-123456 btn">Button</button>
<button class="buttonActive-123456 btn btn-primary">Active Button</button>
```

### Compose with local classes.

Manage element states without rules duplication.
To reference a local rule, prefix the rule name with the `$` symbol.

```javascript
const styles = {
  button: {
    color: 'black'
  },

  // You can chain compositions
  buttonActive: {
    composes: '$button',
    color: 'red'
  },
  buttonActiveDisabled: {
    composes: '$buttonActive',
    opacity: 0.5
  },

  // Or use arrays
  disabled: {
    opacity: 0.5
  },
  active: {
    color: 'red'
  },
  buttonDisabled: {
    composes: ['$button', '$active', '$disabled']
  }
}
```

Compiles to:

```css
.button-123456 {
  color: black;
}
.buttonActive-123456 {
  color: red;
}
.buttonActiveDisabled-123456 {
  opacity: 0.5;
}
.disabled-123456 {
  opacity: 0.5;
}
.active-123456 {
  color: red;
}
/* Rule `buttonDisabled` is not compiled to CSS, because it has no own properties. */
```

When you use it:

```javascript
import React from 'react'

const classes = {
  buttonActiveDisabled: 'buttonActiveDisabled-123456 buttonActive-123456 button-123456',
  buttonDisabled: 'buttonDisabled-123456 button-123456 active-123456 disabled-123456'
}

const button1 = <button className={classes.buttonActiveDisabled}>Active Disabled Button</button>
const button2 = (
  <button className={classes.buttonDisabled}>Disabled Button with active state</button>
)
```

It renders to:

```html
<button class="buttonActiveDisabled-123456 buttonActive-123456 button-123456">
  Active Disabled Button
</button>
<button class="buttonDisabled-123456 button-123456 active-123456 disabled-123456">
  Disabled Button with active state
</button>
```

### Mix global and local classes.

You can compose both local and global classes at the same time.

```javascript
const styles = {
  active: {
    color: 'red'
  },
  button: {
    composes: ['$active', 'btn', 'btn-primary'],
    color: 'blue'
  }
}
```

Compiles to:

```css
.active-123456 {
  color: red;
}
.button-123456 {
  color: blue;
}
```

When you use it:

```javascript
import React from 'react'

const classes = {button: 'button-123456 active-123456 btn btn-primary'}

const button = <button className={classes.button}>Button</button>
```

It renders to:

```html
<button class="button-123456 active-123456 btn btn-primary">Button</button>
```

### Caveats

- It doesn't work within [global Style Sheets](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-global).
- It does not work inside of [nested rules](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-nested).
- When composing local rules, they need to be defined first. Otherwise, you get wrong CSS selector order and specificity.

### Demo

[CodeSandbox](//codesandbox.io/s/github/cssinjs/jss/tree/master/examples/plugins/jss-plugin-compose?fontsize=14)
