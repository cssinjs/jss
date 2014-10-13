## Stylesheets written in javascript.

### Features:

- Truly namespaces.
- Direct access to values and variables from javascript allows to avoid DOM round trip.
- Decide whether to inject a style element or to apply styles directly on element.
- Detach styles from render tree when not used - increases performance.
- All the features you might know from [stylus](http://learnboost.github.io/stylus/) or [sass](http://sass-lang.com/) and much more.
- No need to learn any new syntax.
- No need to precompile, only if you want to.

Take a look at examples directory.

## API

### Access the namespace

```javascript
// Pure js
var jss = window.jss

// Commonjs
var jss = require('jss')
```

### Create stylesheet `jss.createStyle(rules, [attributes])`

Create stylesheet, optionally pass stylesheet attributes, returns a style object.

```javascript
var style = jss.createStyle({
    '.selector': {
        width: 100
    }
}, {media: 'print'})
```

### Attach stylesheet `style.attach()`

Insert stylesheet into render tree.

```javascript
style.attach()
```

### Detach stylesheet `style.detach()`

Remove stylesheet from render tree for performance optimization.

```javascript
style.detach()
```

### Create a namespaced rule `jss.createRule(style)`

In case you have an element reference or you create elements in javascript you might want to write styles and attach them later to the element using a generated class name.

```javascript
var button = jss.createRule({
    padding: 20,
    background: 'blue'
})

document.body.innerHTML = '<button class="' + button.className + '">Button</button>'
```
