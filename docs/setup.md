# Setup

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

You can use jss with or without [plugins](https://github.com/cssinjs?q=plugin). Make sure you use the plugins in the [right order](https://github.com/cssinjs/jss/blob/master/docs/plugins.md#order-does-matter) or just use a [preset](https://github.com/cssinjs/jss-preset-default) for a quick setup with default plugins.

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

You can instruct `jss` to render your stylesheets starting at a specific point in the DOM by placing a comment node anywhere in the `head` or `body` of the document.

This can be useful if you have another dependency that needs to come before or after the `jss` Style Sheets for cascading specificity purposes.

**Note:** the comment node must be an immediate descendant of either the `head` or `body` tag.

You can specify an `insertionPoint` during [jss.setup()](https://github.com/cssinjs/jss/blob/master/docs/js-api.md#setup-jss-instance) and [jss.createStyleSheeet()](https://github.com/cssinjs/jss/blob/master/docs/js-api.md#create-style-sheet).

```html
<head>
    <title>JSS in head</title>
    <!-- jss -->
</head>
```

Here's another example, with the insertion point moved to the top of the `body`: 
```html
<head>
    <title>JSS in body</title>
</head>
<body>
  <!-- jss -->
</body>
```

## CLI

For more information see [CLI](https://github.com/cssinjs/cli).

```bash
npm i jss-cli -g
jss --help
```
