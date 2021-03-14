# Setup

## Install

```bash
yarn add jss
```

Alternatively, you can use [unpkg CDN](./cdn.md).

## Polyfills

Check out the [environment requirements](./environment-requirements.md) as well as our browsers support and required polyfills.

## Setup with the default preset

Use the [default preset](https://github.com/cssinjs/jss/tree/master/packages/jss-preset-default) for quick setup with recommended plugins.

First, install a preset from yarn:

```bash
yarn add jss-preset-default
```

Then setup JSS to use it:

```javascript
import jss from 'jss'
import preset from 'jss-preset-default'

jss.setup(preset())

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

// If you want to render server-side, get the CSS text.
sheet.toString()
```

## Setup with custom plugins

You can use JSS with or without [plugins](https://github.com/cssinjs?q=plugin). Make sure you use the plugins in the [right order](https://github.com/cssinjs/jss/blob/master/docs/plugins.md#order-does-matter) or use a [preset](https://github.com/cssinjs/jss/tree/master/packages/jss-preset-default) for quick setup with default plugins.

```javascript
import jss from 'jss'
import camelCase from 'jss-plugin-camel-case'
import somePlugin from 'jss-some-plugin'

// Use plugins.
jss.use(camelCase(), somePlugin())

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

// If you want to render server-side, get the CSS text.
sheet.toString()
```

## Specify the DOM insertion point

You can instruct JSS to render your stylesheets starting at a specific point in the DOM by placing a comment node anywhere in the `head` of the document.

It can be useful if you have another dependency that needs to come before or after the JSS Style Sheets for source order specificity purposes.

You can specify an `insertionPoint` during [jss.setup()](https://github.com/cssinjs/jss/blob/master/docs/jss-api.md#setup-jss-instance).

```html
<head>
  <title>JSS</title>
  <!-- custom-insertion-point -->
</head>
```

```js
import jss from 'jss'

jss.setup({insertionPoint: 'custom-insertion-point'})
```

Here is another example, with the insertion point moved to the `body`:

```html
<head>
  <title>JSS in body</title>
</head>
<body>
  <div id="insertion-point">
    This might be any DOM node of your choice which can serve as an insertion point.
  </div>
</body>
```

```js
import jss from 'jss'

jss.setup({
  insertionPoint: document.getElementById('insertion-point')
})
```

## Configuring Content Security Policy

You might need to set the `style-src` CSP directive, but do not want to set it to `unsafe-inline`. See [these instructions for configuring CSP](csp.md).

## CLI

For more information see [CLI](https://github.com/cssinjs/cli).

```bash
yarn global add jss-cli
jss --help
```
