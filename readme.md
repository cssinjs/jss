## Composable and reusable style sheets.
[![Codeship](https://codeship.com/projects/a63ccb40-5d57-0133-fdca-6a352dca42a3/status?branch=master)](https://www.codeship.io/projects/111070)
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/jsstyles/jss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![bitHound Score](https://www.bithound.io/jsstyles/jss/badges/score.svg)](https://www.bithound.io/jsstyles/jss)

JSS is a _very_ thin layer which compiles JSON structures to CSS.

Why? To solve composability and code reuse problems for components properly.

Take a look at "[The important parts](https://medium.com/@oleg008/the-important-parts-131dda7f6f6f)" and [JSS is CSS](https://medium.com/@oleg008/jss-is-css-d7d41400b635).

By leveraging [namespaces](http://jsstyles.github.io/jss-examples/namespace/index.html) we can solve the [cascading](http://www.phase2technology.com/blog/used-and-abused-css-inheritance-and-our-misuse-of-the-cascade/) problem better than [bem](http://bem.info/) and make our components truly reusable and composable.

Why do we need transpilers like [sass](http://sass-lang.com/) or [stylus](http://learnboost.github.io/stylus/) when we can use javascript to do the same and much more?

Access css declarations and values from js without DOM round trip.

Smaller footprint because of code reuse and no vendor specific declarations

### When should I use it?

This project fits best when:

- you are building your app out of components
- you are building a reusable UI lib
- your app is not a trivial landing page
- robustness and code reuse is very important to you
- code sharing between js and css is important to you
- typing speed doesn't matter

### Examples.

Working [examples](http://jsstyles.github.io/jss-examples/index.html) directory.

#### Example with extend, nesting, auto px.
```javascript
export default {
  carouselCaption: {
    extend: something,
    position: 'absolute',
    zIndex: 10,
    '&:hover': {
      background: 'red'
    }
  },
  hr: {
    height: 1,
    border: 0,
    borderTop: '1px solid #eee'
  }
}
```

#### Example with @media.
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

### Plugins.

Jss styles are just plain javascript objects. They map 1:1 to css rules, except of those modified by [plugins](https://github.com/jsstyles?query=jss-).

Some of those plugins:

- Nested rules is implemented through [jss-nested](https://github.com/jsstyles/jss-nested) plugin. Also you can do pseudo selectors like `:hover` via nested rules.
- Use `extend` property to inherit from some plain rule object, via [jss-extend](https://github.com/jsstyles/jss-extend)
- Vendor prefixes are automatically added through [jss-vendor-prefixer](https://github.com/jsstyles/jss-vendor-prefixer) plugin.
- You can use camel cased css property names through [jss-camel-case](https://github.com/jsstyles/jss-camel-case) plugin.
- Add 'px' automatically to non numeric values using [jss-px](https://github.com/jsstyles/jss-px)

#### Order does matter! Here is the right one:
  - jss-extend
  - jss-nested
  - jss-camel-case
  - jss-px
  - jss-vendor-prefixer
  - jss-props-sort

#### Authoring plugins is easy.

Register plugin.

`jss.use(fn)`

Passed function will be invoked with Rule instance. Take a look at [plugins](https://github.com/jsstyles?query=jss-) like `extend`, `nested` or `vendorPrefixer`.

```javascript
jss.use(function(rule) {
  // Your modifier.
})
```

### Multiple declarations with identical property names.

I recommend to not to use this if you use jss on the client. Instead you should write a function, which makes a [test](https://github.com/jsstyles/css-vendor) for this feature support and generates just one final declaration.

In case you are using jss as a server side precompiler, you might want to have more than one property with identical name. This is not possible in js, but you can use an array.

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

## API

### Access the jss namespace.

```javascript
// Pure js
var jss = window.jss

// Commonjs
var jss = require('jss')

// ES6
import jss from 'jss'
```

### Create an own instance of JSS.

Use an own instance if the component you build should be reusable within a different project with a probably different JSS setup.

`jss.create()`

```js

// ES5
var jss = require('jss').create()
jss.use(somePlugin)
jss.createStyleSheet(...)

// ES6
import {create} from 'jss'
let jss = create()
jss.use(somePlugin)
jss.createStyleSheet(...)
```

### Create style sheet with namespaces enabled.

Create a style sheet with [namespaced](http://jsstyles.github.io/jss-examples/namespace/index.html) rules.

`jss.createStyleSheet([rules], [options])`

Options:

- `media` media query - attribute of style element.
- `meta` meta information about this style - attribute of style element, for e.g. you could pass component name for easier debugging.
- `named` true by default - keys are names, selectors will be generated, if false - keys are global selectors.
- `link` link jss `Rule` instances with DOM `CSSRule` instances so that styles, can be modified dynamically, false by default because it has some performance cost.

```javascript
// Namespaced style sheet with generated selectors.
let sheet = jss.createStyleSheet({
  button: {
    width: 100,
    height: 100
  }
}, {media: 'print'}).attach()

console.log(sheet.classes.button) // .button--jss-0-0
```

```css
<style media="print">
  .button--jss-0-0 {
    width: 100px;
    height: 100px;
  }
</style>
```

### Create regular style sheet with global selectors.

```javascript
let sheet = jss.createStyleSheet({
  '.something': {
    width: 100,
    height: 100
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

### Attach style sheet.

`sheet.attach()`

Insert style sheet into the render tree. You need to call it in order to make your style sheet visible for the layout.

### Detach style sheet.

`sheet.detach()`

Detaching unsused style sheets will speedup every DOM node insertion and manipulation as the browser will have to do less lookups for css rules potentially to be applied to the element.

### Add a rule to an existing style sheet.

`sheet.addRule([selector], rule)`

#### Add a rule dynamically with a generated class name.

```javascript
let rule = sheet.addRule({
  padding: 20,
  background: 'blue'
})
document.body.innerHTML = '<button class="' + rule.className + '">Button</button>'
```

#### Add a rule with global class name.

```javascript
let rule = sheet.addRule('.my-button', {
  padding: 20,
  background: 'blue'
}, {named: false})
```

### Get a rule.

`sheet.getRule(name)`

Access a rule within sheet by selector or name.

```javascript
// Using name, if named rule was added.
let rule = sheet.getRule('myButton')

// Using selector
let rule = sheet.getRule('.my-button')
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
let rule = jss.createRule({
  padding: 20,
  background: 'blue'
})
```

### Apply a rule to an element inline.

`rule.applyTo(element)`

This is equivalent to `element.style.background = 'blue'` except of that you could use a rule from sheet which is already defined and can apply plugins to it. [Example.](http://jsstyles.github.io/jss-examples/apply-to/index.html)

```javascript
jss.createRule({
  background: 'blue'
}).applyTo(element)
```

### Set or get a rule property dynamically.

`rule.prop(name, [value])`

When option `link` is true, after stylesheet is attached, linker saves references to `CSSRule` instances so that you are able to set rules properties at any time. [Example.](http://jsstyles.github.io/jss-examples/dynamic-props/index.html)

```javascript
let sheet = jss.createStyleSheet({
  a: {
    color: 'red'
  }
}, {link: true})

// Get the color.
sheet.getRule('a').prop('color') // red

// Set the color.
sheet.getRule('a').prop('color', 'green')
```

### Convert rule to a JSON.

`rule.toJSON()`

Returns JSON representation of a rule. Only regular rules are supported,
no nested, conditionals, keyframes or array values.

Result of toJSON call can be used later to apply styles inline to the element.

### Convert to CSS

`sheet.toString()`

If you want to get a pure CSS string from JSS for e.g. when preprocessing server side.

```javascript
import jss from 'jss'

let sheet = jss.createStyleSheet({
  button: {
    float: 'left',
  }
})

console.log(sheet.toString())
```

```css
.button--jss-0-0 {
  float: left;
}
```
## Install

```bash
npm i jss
```

A command line interface for JSS is also available:

```bash
npm i jss-cli -g
```

For more information see [CLI](https://github.com/jsstyles/jss-cli).

## Benchmarks

1. How fast would bootstrap css lib render?
I have converted bootstraps css to jss. In `bench/bootstrap` folder you will find [jss](http://jsstyles.github.io/jss/bench/bootstrap/jss.html) and [css](http://jsstyles.github.io/jss/bench/bootstrap/css.html) files. You need to try more than once to have some average value.

    On my machine overhead is about 10-15ms.

1. Rendering jss vs. css (same styles) [jsperf bench](http://jsperf.com/jss-vs-css/3).

## Run tests

```bash
npm i
npm test
```

## License

MIT

## Thanks

Thanks to [BrowserStack](https://www.browserstack.com) for providing the infrastructure that allows us to run our build in real browsers.
