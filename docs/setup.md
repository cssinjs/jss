## Install

Using npm

```bash
npm i jss
```

For bower or direct script injection use [unpkg](https://unpkg.com):

Full:
https://unpkg.com/jss/dist/jss.js

Minified:
https://unpkg.com/jss/dist/jss.min.js

## Setup with plugins

You can use jss with or without [plugins](https://github.com/cssinjs?query=jss-). Make sure you use the plugins in the [right order](https://github.com/cssinjs/jss/blob/master/docs/plugins.md#order-does-matter) or just use a [preset](https://github.com/cssinjs/jss-preset-default) for a quick setup with default plugins.

```javascript

import jss from 'jss'
import camelCase from 'jss-camel-case'

// Use plugins.
jss.use(camelCase())

// Create your style.
const style = {
  myButton: {
    color: 'green'
  }
}

// Compile styles, apply plugins.
const sheet = jss.createStyleSheet(style)

// If you want to render on the client, insert it into DOM.
sheet.attach()

// If you want to render server-side, get the css text.
sheet.toString()
```

## Specify DOM insertion point

You can instruct `jss` to render your stylesheets starting at a specific point in the DOM by placing a comment node anywhere in the `head` of the document.

This can be useful if you have another dependency that needs to come before or after the `jss` style sheets for cascading specificity purposes.

```html
<head>
    <title>JSS</title>
    <!-- jss -->
</head>
```

## CLI

For more information see [CLI](https://github.com/cssinjs/jss-cli).

```bash
npm i jss-cli -g
jss --help
```

## Run tests

Using karma (real browsers will be launched)

```bash
npm i
npm test
```

Or manually

```bash
npm run build:test
open tests/index.html
```

