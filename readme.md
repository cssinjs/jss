## JSS

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/cssinjs/lobby)
[![Build Status](https://travis-ci.org/cssinjs/jss.svg?branch=master)](https://travis-ci.org/cssinjs/jss)
[![codecov](https://codecov.io/gh/cssinjs/jss/branch/master/graph/badge.svg)](https://codecov.io/gh/cssinjs/jss)
[![bitHound Score](https://www.bithound.io/cssinjs/jss/badges/score.svg)](https://www.bithound.io/cssinjs/jss)

[JSS is a better abstraction](https://medium.com/@oleg008/jss-is-css-d7d41400b635) over CSS. It uses JavaScript as a language to describe styles in a declarative and maintainable way. It compiles to CSS at runtime or server-side and is potentially more performant. You can use it with [React](https://github.com/cssinjs/react-jss) or with any other library. It is less than 4KB (minfied and gzipped) and is extensible via [plugins](./docs/plugins.md) API.

### TOC

1. [Live examples](http://cssinjs.github.io/examples/index.html).
1. [Benefits](./docs/benefits.md)
1. [Setup](./docs/setup.md)
1. [JSON API](./docs/json-api.md)
1. [JavaScript API](./docs/js-api.md)
1. [Server-side rendering](./docs/ssr.md)
1. [Performance](./docs/performance.md)
1. [Plugins API](./docs/plugins.md)
1. [Official plugins](https://github.com/cssinjs?query=jss-)
1. [External projects](./docs/external-projects.md)
1. [CLI Converter](https://github.com/cssinjs/cli)

### Example

You think writing CSS in JS is ugly?
Try [CSSX](https://github.com/krasimir/cssx), it compiles to JSS JSON and allows you to write  in CSSX language, but render with JSS.

You need to [setup plugins](./docs/setup.md#setup-with-plugins) before.
You can use a [preset](https://github.com/cssinjs/jss-preset-default) for a quick setup with default plugins.

```javascript
import jss from 'jss'
import preset from 'jss-preset-default'

// One time setup with default plugins and settings.
jss.setup(preset())

const styles = {
  button: {
    fontSize: 12,
    '&:hover': {
      background: 'blue'
    }
  },
  ctaButton: {
    extend: 'button',
    '&:hover': {
      background: 'red'
    }
  },
  '@media (min-width: 1024px)': {
    button: {
      minWidth: 200
    }
  }
}

const {classes} = jss.createStyleSheet(styles).attach()

document.body.innerHTML = `
  <button class="${classes.button}">Button</button>
  <button class="${classes.ctaButton}">CTA Button</button>
`
```

Result

```html
<head>
  <style type="text/css">
    .button-123456 {
      font-size: 12px;
    }
    .button-123456:hover {
      background: blue;
    }
    .ctaButton-789012 {
      font-size: 12px;
    }
    .ctaButton-789012:hover {
      background: red;
    }
    @media (min-width: 1024px) {
      .button-123456 {
        min-width: 200px;
      }
    }
  </style>
</head>
<body>
  <button class="button-123456">Button</button>
  <button class="ctaButton-789012">CTA Button</button>
</body>
```
### When should I use it?

- You build a JavaScript heavy application.
- You use components based architecture.
- You build a reusable UI library.
- You need a collision free CSS (external content, third-party UI components ...).
- You need code sharing between js and css.
- Minimal download size is important to you.
- Robustness and code reuse is important to you.
- Ease of maintenance is important to you.
- You just want to use any of its [benefits](./docs/benefits.md)

### Roadmap

1. ~~Make it easier for newcomers to setup jss with plugins (like presets).~~
1. Make community create plugins (better plugins API documentation, infrastructure).
1. Make it easy to see when changes in the core break plugins (integrate plugins test suite).
1. Do more benchmarking, include plugins, always track perf regressions.
1. Make JSON DSL even better, for e.g. [jss-expand](https://github.com/typical000/jss-expand).
1. Introduce a way for theming with react-jss.
1. Make SSR even better (vendor prefixer, smaller critical CSS)
1. Make CLI tool better, allow integration of styles written in various preprocessing languages as well as pure css.
1. React Native support.

### Browsers Support

We have automated tests running in [real browsers](./browsers.json).

### License

MIT

### Thanks

Thanks to [BrowserStack](https://www.browserstack.com) for providing the infrastructure that allows us to run our build in real browsers and to all awesome [contributors](https://github.com/cssinjs/jss/graphs/contributors).
