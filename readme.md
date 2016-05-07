## JSS

[![Build Status](https://travis-ci.org/jsstyles/jss.svg?branch=master)](https://travis-ci.org/jsstyles/jss)
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/jsstyles/jss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![bitHound Score](https://www.bithound.io/jsstyles/jss/badges/score.svg)](https://www.bithound.io/jsstyles/jss)

[JSS is a better abstraction](https://medium.com/@oleg008/jss-is-css-d7d41400b635) over CSS. It uses JavaScript as a language to describe styles in a declarative and maintainable way. It compiles to CSS at runtime or server-side and is potentially more performant. You can use it with [React](https://github.com/jsstyles/react-jss) or with any other library. It is less than 4KB (minfied and gzipped) and is extensible via [plugins](./docs/plugins.md) API.

### Links

- [Benefits](./docs/benefits.md)
- [Installation and setup](./docs/setup.md)
- [Full documentation](./docs/index.md)
- [Playground](http://jsstyles.github.io/repl/)
- [Online examples](http://jsstyles.github.io/examples/index.html).
- [Official plugins](https://github.com/jsstyles?query=jss-)
- [External projects](./docs/external-projects.md)

### Example

You think writing CSS in JS is ugly?
Try [CSSX](https://github.com/krasimir/cssx), it compiles to JSS JSON and allows you to write  in CSSX language, but render with JSS.

```javascript
export default {
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
```

Converts to:

```css
.button--jss-0-0 {
  font-size: 12px;
}
.button--jss-0-0:hover {
  background: blue;
}
.ctaButton--jss-0-2 {
  font-size: 12px;
}
.ctaButton--jss-0-2:hover {
  background: red;
}
@media (min-width: 1024px) {
  .button--jss-0-0 {
    min-width: 200px;
  }
}
```

Render styles to the DOM ([setup plugins](./docs/setup.md#setup-with-plugins) before):

```javascript
import jss from 'jss'

const {classes} = jss.createStyleSheet(styles).attach()

classes // {button: '.button--jss-0-0 ', ctaButton: '.ctaButton--jss-0-2'}

document.body.innerHTML = `
  <button class="${classes.button}">Button</button>
  <button class="${classes.ctaButton}">CTA Button</button>
`
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

### Support

We have automated tests running in [real browsers](./browsers.json).

### License

MIT

### Thanks

Thanks to [BrowserStack](https://www.browserstack.com) for providing the infrastructure that allows us to run our build in real browsers and to all awesome [contributors](https://github.com/jsstyles/jss/graphs/contributors).
