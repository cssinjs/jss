## Install

Using npm

```bash
npm i jss
```

For bower or direct script injection use [npmcdn](https://npmcdn.com):

Full:
https://npmcdn.com/jss/dist/jss.js

Minified:
https://npmcdn.com/jss/dist/jss.min.js

## Setup with plugins

You can use jss with or without [plugins](https://github.com/jsstyles?query=jss-).

```javascript

import jss from 'jss'
import somePlugin from 'some-plugin'

// Use plugins.
jss.use(somePlugin())

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

## CLI

For more information see [CLI](https://github.com/jsstyles/jss-cli).

```bash
npm i jss-cli -g
jss --help
```

## Run tests

```bash
npm i
npm test
```
