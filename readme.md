# JSS

[![Gitter](https://badges.gitter.im/JoinChat.svg)](https://gitter.im/cssinjs/lobby)
[![Build Status](https://travis-ci.org/cssinjs/jss.svg?branch=master)](https://travis-ci.org/cssinjs/jss)
[![codecov](https://codecov.io/gh/cssinjs/jss/branch/master/graph/badge.svg)](https://codecov.io/gh/cssinjs/jss)
[![bitHound Score](https://www.bithound.io/cssinjs/jss/badges/score.svg)](https://www.bithound.io/cssinjs/jss)
[![OpenCollective](https://opencollective.com/jss/backers/badge.svg)](#backers)
[![OpenCollective](https://opencollective.com/jss/sponsors/badge.svg)](#sponsors)


[JSS is a better abstraction](https://medium.com/@oleg008/jss-is-css-d7d41400b635) over CSS. It uses JavaScript as a language to describe styles in a declarative and maintainable way. It is a [high performance](https://github.com/cssinjs/jss/blob/master/docs/performance.md) JS to CSS compiler which works at runtime and server-side. You can use it with [React](https://github.com/cssinjs/react-jss) or with any other library. It is about 5KB (minified and gzipped) and is extensible via [plugins](./docs/plugins.md) API.

## Integrations

### Official

- [React-JSS](https://github.com/cssinjs/react-jss) - HOC interface for React, try it on [webpackbin](https://www.webpackbin.com/bins/-Kn90iijPuAJO48ItgF-).
- [Styled-JSS](https://github.com/cssinjs/styled-jss) - styled components interface for React, try it on [webpackbin](https://www.webpackbin.com/bins/-KlrbQuwAZSK5eSzpCSy).
- [Aphrodite-JSS](https://github.com/cssinjs/aphrodite-jss) - aphrodite like API.

### External

- [Theme Reactor](https://github.com/nathanmarks/jss-theme-reactor) - experimental React integration with theming.
- [Aesthetic](https://github.com/milesj/aesthetic/tree/master/packages/aesthetic) - a React style abstraction layer with theme support.

## TOC

1. [Live examples](https://github.com/cssinjs/examples).
1. [Benefits](./docs/benefits.md)
1. [Setup](./docs/setup.md)
1. [JSON API (JSS Syntax)](./docs/json-api.md)
1. [JavaScript API](./docs/js-api.md)
1. [Server-side rendering](./docs/ssr.md)
1. [Performance](./docs/performance.md)
1. [Plugins API](./docs/plugins.md)
1. [Official plugins](https://github.com/cssinjs?q=plugin)
1. [All related projects](./docs/projects.md)
1. [CLI Converter](https://github.com/cssinjs/cli)
1. [Contributing](./contributing.md)


## Example

Try it out on [webpackbin](https://www.webpackbin.com/bins/-KlrNqkpZZmKIz0eYwIk).
You need to [setup plugins](./docs/setup.md#setup-with-plugins) before.
You can use a [preset](https://github.com/cssinjs/jss-preset-default) for a quick setup with default plugins.

```javascript
import jss from 'jss'
import preset from 'jss-preset-default'
import color from 'color'

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
      background: color('blue').darken(0.3).hex()
    }
  },
  '@media (min-width: 1024px)': {
    button: {
      width: 200
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
## When should I use it?

- You build a JavaScript heavy application.
- You use components based architecture.
- You build a reusable UI library.
- You need a collision free CSS (external content, third-party UI components ...).
- You need code sharing between js and css.
- Minimal download size is important to you.
- Robustness and code reuse is important to you.
- Ease of maintenance is important to you.
- You just want to use any of its [benefits](./docs/benefits.md)

## Roadmap

- ~~Make it easier for newcomers to setup jss with plugins (like presets).~~
- ~~Make JSON DSL even better, for e.g. [jss-expand](https://github.com/typical000/jss-expand).~~
- ~~Make it easy to see when changes in the core break plugins (integrate plugins test suite).~~
- Make community create plugins (better plugins API documentation, infrastructure).
- Do more benchmarking, include plugins, always track perf regressions.
- Introduce a way for theming with react-jss or replace it by [jss-theme-reactor](https://github.com/nathanmarks/jss-theme-reactor)
- Make SSR even better (vendor prefixer, smaller critical CSS)
- Make CLI tool better, allow integration of styles written in various preprocessing languages as well as pure css.
- React Native support.
- Add converters stylus, sass and co. to [cli](https://github.com/cssinjs/cli) with constants reuse.

## Browsers Support

We have automated tests running in [real browsers](./browsers.json).

## License

MIT

## Thanks

Thanks to [BrowserStack](https://www.browserstack.com) for providing the infrastructure that allows us to run our tests in real browsers and to all awesome [contributors](https://github.com/cssinjs/jss/graphs/contributors).

### Backers

Support us with a monthly donation and help us continue our activities. [[Become a backer](https://opencollective.com/jss#backer)]

<a href="https://opencollective.com/jss/backer/0/website" target="_blank"><img src="https://opencollective.com/jss/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/1/website" target="_blank"><img src="https://opencollective.com/jss/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/2/website" target="_blank"><img src="https://opencollective.com/jss/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/3/website" target="_blank"><img src="https://opencollective.com/jss/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/4/website" target="_blank"><img src="https://opencollective.com/jss/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/5/website" target="_blank"><img src="https://opencollective.com/jss/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/6/website" target="_blank"><img src="https://opencollective.com/jss/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/7/website" target="_blank"><img src="https://opencollective.com/jss/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/8/website" target="_blank"><img src="https://opencollective.com/jss/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/9/website" target="_blank"><img src="https://opencollective.com/jss/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/10/website" target="_blank"><img src="https://opencollective.com/jss/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/11/website" target="_blank"><img src="https://opencollective.com/jss/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/12/website" target="_blank"><img src="https://opencollective.com/jss/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/13/website" target="_blank"><img src="https://opencollective.com/jss/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/14/website" target="_blank"><img src="https://opencollective.com/jss/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/15/website" target="_blank"><img src="https://opencollective.com/jss/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/16/website" target="_blank"><img src="https://opencollective.com/jss/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/17/website" target="_blank"><img src="https://opencollective.com/jss/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/18/website" target="_blank"><img src="https://opencollective.com/jss/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/19/website" target="_blank"><img src="https://opencollective.com/jss/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/20/website" target="_blank"><img src="https://opencollective.com/jss/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/21/website" target="_blank"><img src="https://opencollective.com/jss/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/22/website" target="_blank"><img src="https://opencollective.com/jss/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/23/website" target="_blank"><img src="https://opencollective.com/jss/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/24/website" target="_blank"><img src="https://opencollective.com/jss/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/25/website" target="_blank"><img src="https://opencollective.com/jss/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/26/website" target="_blank"><img src="https://opencollective.com/jss/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/27/website" target="_blank"><img src="https://opencollective.com/jss/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/28/website" target="_blank"><img src="https://opencollective.com/jss/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/jss/backer/29/website" target="_blank"><img src="https://opencollective.com/jss/backer/29/avatar.svg"></a>

### Sponsors

Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/jss#sponsor)]

<a href="https://opencollective.com/jss/sponsor/0/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/1/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/2/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/3/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/4/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/5/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/6/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/7/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/8/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/9/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/10/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/10/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/11/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/11/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/12/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/12/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/13/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/13/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/14/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/14/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/15/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/15/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/16/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/16/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/17/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/17/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/18/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/18/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/19/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/19/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/20/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/20/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/21/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/21/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/22/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/22/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/23/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/23/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/24/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/24/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/25/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/25/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/26/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/26/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/27/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/27/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/28/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/28/avatar.svg"></a>
<a href="https://opencollective.com/jss/sponsor/29/website" target="_blank"><img src="https://opencollective.com/jss/sponsor/29/avatar.svg"></a>
