## Composable and reusable style sheets.

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/jsstyles/jss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![bitHound Score](https://www.bithound.io/jsstyles/jss/badges/score.svg)](https://www.bithound.io/jsstyles/jss)

JSS is a _very_ thin layer which compiles JSON structures to CSS.

Take a look at "[The important parts](https://medium.com/@oleg008/the-important-parts-131dda7f6f6f)" and [slides](http://slides.com/kof/jss).

By leveraging [namespaces](http://jsstyles.github.io/jss/examples/namespace/index.html) we can solve the [cascading](http://www.phase2technology.com/blog/used-and-abused-css-inheritance-and-our-misuse-of-the-cascade/) problem better than [bem](http://bem.info/) and make our components truly reusable and composable.

Why do we need transpilers like [sass](http://sass-lang.com/) or [stylus](http://learnboost.github.io/stylus/) when we can use javascript to do the same and much more?

[Access css](http://jsstyles.github.io/jss/examples/commonjs/index.html) declarations and values from js without DOM round trip.

Smaller footprint because of code reuse and no vendor specific declarations

Take a look at [examples](http://jsstyles.github.io/jss/examples/index.html) directory.

### Syntactic differences compared to CSS

Jss styles are just plain javascript objects. They map 1:1 to css rules, except of those modified by [plugins](https://github.com/jsstyles?query=jss-).

```javascript
// Some random jss code example
{
  carouselCaption: {
    position: 'absolute',
    'z-index': 10
  },
  hr: {
    border: 0,
    'border-top': '1px solid #eee'
  }
}
```

### Multiple declarations with identical property names

I recommend to not to use this if you use jss on the client. Instead you should write a function, which makes a [test](https://github.com/jsstyles/css-vendor) for this feature support and generates just one final declaration.

In case you are using jss as a server side precompiler, you might want to have more than one property with identical name. This is not possible in js, but you can use an array.

```js
{
    '.container': {
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
.container {
    background: red;
    background: -moz-linear-gradient(left, red 0%, green 100%);
    background: -webkit-linear-gradient(left, red 0%, green 100%);
    background: -o-linear-gradient(left, red 0%, green 100%);
    background: -ms-linear-gradient(left, red 0%, green 100%);
    background: linear-gradient(to right, red 0%, green 100%);
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


### Create style sheet with namespaces enabled.

Create a style sheet with [namespaced](http://jsstyles.github.io/jss/examples/namespace/index.html) rules.

`jss.createStyleSheet([rules], [options])`

Options:

- `media` style element attribute
- `title` style element attribute
- `type` style element attribute
- `named` true by default - keys are names, selectors will be generated,
    if false - keys are global selectors.
- `link` link jss `Rule` instances with DOM `CSSRule instances so that styles, can be modified dynamically, false by default because it has some performance cost.

```javascript
var sheet = jss.createStyleSheet({
    myButton: {
        width: '100px',
        height: '100px'
    }
}, {media: 'print'}).attach()

console.log(sheet.classes.myButton) // .jss-0
```

```css
<style media="print">
    .jss-0 {
        width: 100px;
        height: 100px;
    }
</style>
```

### Create regular style sheet with global selectors.

```javascript
var sheet = jss.createStyleSheet({
    '.something': {
        width: '100px',
        height: '100px'
    }
}, {named: false}).attach()
```

```css
<style>
    .something {
        width: 100px;
        height: 100px;
    }
</style>
```

### Attach style sheet

`sheet.attach()`

Insert style sheet into the render tree. You need to call it in order to make your style sheet visible for the layout.

### Detach style sheet

`sheet.detach()`

Detaching unsused style sheets will speedup every DOM node insertion and manipulation as the browser will have to do less lookups for css rules potentially to be applied to the element.

### Add a rule

`sheet.addRule([selector], rule)`

Returns an array of rules, because you might have a [nested](https://github.com/jsstyles/jss-nested) rule in your style.

#### Add a rule dynamically with a generated class name.

```javascript
var rules = sheet.addRule({
    padding: '20px',
    background: 'blue'
})
document.body.innerHTML = '<button class="' + rules[0].className + '">Button</button>'
```

#### Add a rule with global class name.

```javascript
var rules = sheet.addRule('.my-button', {
    padding: '20px',
    background: 'blue'
})
```

### Get a rule.

`sheet.getRule(name)`

Access a rule within sheet by selector or name.

```javascript
// Using name, if named rule was added.
var rule = sheet.getRule('myButton')

// Using selector
var rule = sheet.getRule('.my-button')
```

### Add multiple rules.

`sheet.addRules(rules)`

In case you want to add rules to the sheet separately or even at runtime.

```javascript
sheet.addRules({
    myButton: {
        float: 'left',
    },
    something: {
        display: 'none'
    }
})
```

### Create a rule without a style sheet.

`jss.createRule([selector], rule)`

In order to apply styles directly to the element but still be able to use jss plugins.

```javascript
var rule = jss.createRule({
    padding: '20px',
    background: 'blue'
})

rule.applyTo(element)
```

### Apply a rule to an element inline.

`rule.applyTo(element)`

This is equivalent to `element.style.background = 'blue'` except of that you could use a rule from sheet which is already defined and can apply plugins to it. [Example.](http://jsstyles.github.io/jss/examples/apply-to/index.html)

```javascript
jss.createRule({
    background: 'blue'
}).applyTo(element)
```

### Set or get a rule property dynamically.

`rule.prop(name, [value])`

When option `link` is true, after stylesheet is attached, linker saves references to `CSSRule` instances so that you are able to set rules properties at any time. [Example.](http://jsstyles.github.io/jss/examples/dynamic-props/index.html)

```javascript
var sheet = jss.createStyleSheet({
    a: {
        color: 'red'
    }
}, {link: true})

// Get the color.
sheet.getRule('a').prop('color') // red

// Set the color.
sheet.getRule('a').prop('color', 'green')
```

### Get JSON.

`rule.toJSON()`

Returns JSON representation of the rule. Nested rules, at-rules and array values are not supported.

### Register plugin.

`jss.use(fn)`

Passed function will be invoked with Rule instance. Take a look at [plugins](https://github.com/jsstyles?query=jss-) like `extend`, `nested` or `vendorPrefixer`.

```javascript
jss.use(function(rule) {
    // Your modifier.
})
```

### Convert to CSS

`sheet.toString()`

If you want to get a pure CSS string from jss e.g. for preprocessing jss on the server.

```javascript

var jss = require('jss')

var sheet = jss.createStyleSheet({
    myButton: {
        float: 'left',
    }
})

console.log(sheet.toString())
```

```css
.jss-0 {
  float: left;
}
```

## Plugins

Things you know from stylus like @extend, nested selectors, vendor prefixer are separate plugins.

[Full list of available plugins](https://github.com/jsstyles?query=jss-)


## Install

```bash
npm install jss
#or
bower install jsstyles
```

## Convert CSS to JSS


```bash
# print help
jss
# convert css
jss source.css -p > source.jss
```

## Benchmarks

1. How fast would bootstrap css lib render?
I have converted bootstraps css to jss. In `bench/bootstrap` folder you will find [jss](http://jsstyles.github.io/jss/bench/bootstrap/jss.html) and [css](http://jsstyles.github.io/jss/bench/bootstrap/css.html) files. You need to try more than once to have some average value.

    On my machine overhead is about 10-15ms.

1. Rendering jss vs. css (same styles) [jsperf bench](http://jsperf.com/jss-vs-css/3).

## Run tests

### Locally
```bash
npm i
open test/local.html
```
### From github

[Tests](https://jsstyles.github.com/jss/test)

## License

MIT
