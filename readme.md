## Dynamic stylesheets for web components.

Why do we need transpilers like [sass](http://sass-lang.com/) or [stylus](http://learnboost.github.io/stylus/) when we can use javascript to do the same and much more?

By leveraging [namespaces](http://kof.github.io/jss/examples/namespace/index.html) we can solve the [cascading](http://www.phase2technology.com/blog/used-and-abused-css-inheritance-and-our-misuse-of-the-cascade/) problem better than [bem](http://bem.info/) and make our components truly reusable and composable.

[Access css](http://kof.github.io/jss/examples/commonjs/index.html) declarations and values from js without DOM round trip.

Smaller footprint because of code reuse and no vendor specific declarations

Take a look at [examples](http://kof.github.io/jss/examples/index.html) directory.

## Built in preprocessors

Jss styles are just plain javascript objects. They map 1:1 to css rules, except of those modified by preprocessors.

### Nested Rules

Put an `&` before a selector within a rule and it will be replaced by the parent selector and extracted to a [separate rule](http://kof.github.io/jss/examples/nested/index.html).


```javascript
{
    '.container': {
        padding: '20px',
        // Will result in .container.clear
        '&.clear': {
            clear: 'both'
        },
        // Will result in .container .button
        '& .button': {
            background: 'red'
        },
        '&.selected, &.active': {
            border: '1px solid red'
        }
    }
}
```
```css
.container {
    padding: 20px;
}
.container.clear {
    clear: both;
}
.container .button {
    background: red;
}
.container.selected, .container.active {
    border: 1px solid red;
}
```

### Inheritance

Inherit a rule(s) by using `extend` keyword. This makes it easy to reuse code. [See example.](http://kof.github.io/jss/examples/extend/index.html)


```javascript
var rules = {}

var button1 = {
    padding: '20px',
    background: 'blue'
}

rules['.button-1'] = button1

rules['.button-2'] = {
    extend: button1, // can be an array of styles
    padding: '30px'
}
```
```css
.button-1 {
    padding: 20px;
    background: blue;
}

.button-2 {
    padding: 30px;
    background: blue;
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

### Create stylesheet

`jss.createStylesheet([rules], [named], [attributes])`

- `rules` is an object, where keys are selectors if `named` is not true
- `named` rules keys are not used as selectors, but as names, will cause auto generated class names and selectors. It will also make class names accessible via `stylesheet.classes`.
- `attributes` allows to set any attributes on style element.


```javascript
var stylesheet = jss.createStylesheet({
    '.selector': {
        width: '100px'
    }
}, {media: 'print'}).attach()
```

```css
<style type="text/css" media="print">
    .selector {
        width: 100px;
    }
</style>
```

Create a stylesheet with [namespaced](http://kof.github.io/jss/examples/namespace/index.html) rules.

```javascript
var stylesheet = jss.createStylesheet({
    myButton: {
        width: '100px',
        height: '100px'
    }
}, true).attach()

console.log(stylesheet.classes.myButton) // .jss-0
```

```css
<style type="text/css" media="screen">
    .jss-0 {
        width: 100px;
        height: 100px;
    }
</style>
```

### Attach stylesheet

`stylesheet.attach()`

Insert stylesheet into render tree.

```javascript
stylesheet.attach()
```

### Detach stylesheet

`stylesheet.detach()`

Remove stylesheet from render tree to increase runtime performance.

```javascript
stylesheet.detach()
```

### Add a rule

`stylesheet.addRule([selector], rule)`

#### You might want to add rules dynamically.

```javascript
var button = stylesheet.addRule('.my-button', {
    padding: '20px',
    background: 'blue'
})
```
#### Generated namespace.

In case you have an element reference or you create elements in javascript you might want to write styles and attach them later to the element using a generated class name.

```javascript
var button = stylesheet.addRule({
    padding: '20px',
    background: 'blue'
})

document.body.innerHTML = '<button class="' + button.className + '">Button</button>'
```

### Get a rule

`stylesheet.getRule(selector)`

```javascript
// Using selector
var rule = stylesheet.getRule('.my-button')

// Using name, if named rule was added.
var rule = stylesheet.getRule('myButton')

```

### Add a rules

`stylesheet.addRules(rules)`

Add a list of rules.

```javascript
stylesheet.addRules({
    '.my-button': {
        float: 'left',
    },
    '.something': {
        display: 'none'
    }
})
```

### Create a rule without a stylesheet.

`jss.createRule([selector], rule)`

```javascript
var rule = jss.createRule({
    padding: '20px',
    background: 'blue'
})

// Apply styles directly using jquery.
$('.container').css(rule.style)
```

## Install

```bash
npm i jss
```

## Convert CSS to JSS


```bash
# print help
jss
# convert css
jss source.css -p > source.jss
```

## Benchmarks

To make some realistic assumptions about performance overhead, I have converted bootstraps css to jss. In `bench/bootstrap` folder you will find [jss](http://kof.github.io/jss/bench/bootstrap/jss.html) and [css](http://kof.github.io/jss/bench/bootstrap/css.html) files. You need to try more than once to have some average value.

In my tests overhead is 10-15ms.

## Run tests

### Locally
```bash
npm i
open test/local.html
```
### From github

[Tests](https://kof.github.com/jss/test)

## License

MIT
