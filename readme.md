## Stylesheets written in javascript.

### Features:

- [True namespaces.](./examples/namespace)
- [Direct access](./examples/commonjs) to values and variables from javascript allows to avoid DOM round trip.
- Decide whether to inject a style element or to [apply styles directly](./examples/jquery) on element.
- [Detach styles](./examples/simple) from render tree when not used - increases performance.
- All the features you might know from [stylus](http://learnboost.github.io/stylus/) or [sass](http://sass-lang.com/) and much more.
- Its just plain javascript objects, declarative syntax.
- No need to precompile, but you can if you want to.

Take a look at [examples](http://kof.github.io/jss/examples/index.html) directory.

## Syntax

Jss styles are just plain javascript objects. They map almost 1:1 to css rules.

### Numeric values

Numeric values will get 'px' suffix.


```javascript
{
    '.container': {
        padding: 20
    }
}
```
```css
.container {
    padding: 20px;
}
```

### Scoped selectors

Put a space before a selector within a rule and it will be converted to a separate rule with a [scoped selector.](http://kof.github.io/jss/examples/scoped/index.html)


```javascript
{
    '.container': {
        padding: 20,
        ' .button': {
            background: 'red'
        }
    }
}
```
```css
.container {
    padding: 20px;
}
.container .button {
    background: red;
}
```

## API

### Access the jss namespace

```javascript
// Pure js
var jss = window.jss

// Commonjs
var jss = require('jss')
```

### Create stylesheet `jss.createStyle([rules], [attributes])`

Create stylesheet, optionally pass stylesheet attributes, returns a Style instance.

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

### Add a rule `style.addRule([selector], rule)`

#### You might want to add rules dynamically.

```javascript
var button = style.addRule('.my-button', {
    padding: 20,
    background: 'blue'
})
```
#### Generated namespace.

In case you have an element reference or you create elements in javascript you might want to write styles and attach them later to the element using a generated class name.

```javascript
var button = style.addRule({
    padding: 20,
    background: 'blue'
})

document.body.innerHTML = '<button class="' + button.className + '">Button</button>'
```

### Get a rule `style.getRule(selector)`

```javascript
var rule = style.getRule('.my-button')
```

### Create a rule `jss.createRule([selector], rule)`

In case you want to create a rule without to add it to a stylesheet.

```javascript
var rule = jss.createRule({
    padding: 20,
    background: 'blue'
})

$('.container').css(rule.style)
```
