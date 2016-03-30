## JSS

[![Codeship](https://codeship.com/projects/a63ccb40-5d57-0133-fdca-6a352dca42a3/status?branch=master)](https://www.codeship.io/projects/111070)
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/jsstyles/jss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![bitHound Score](https://www.bithound.io/jsstyles/jss/badges/score.svg)](https://www.bithound.io/jsstyles/jss)

[JSS is a higher level abstraction](https://medium.com/@oleg008/jss-is-css-d7d41400b635) over CSS. It allows you to describe styles in JSON and leverage the power of JavaScript. It generates style sheets at runtime or [server-side](./docs/server-side.md) and has a number of [benefits](./docs/benefits.md).

You can use [JSS with React](https://github.com/jsstyles/react-jss), or with any other js library. It is small, modular and extensible via [plugins](./docs/plugins.md) API.


### Links

[Benefits](./docs/benefits.md)

[Installation and setup](./docs/setup.md)

[Full documentation](./docs/index.md)

[Playground](http://jsstyles.github.io/repl/)

[Online examples](http://jsstyles.github.io/examples/index.html).

[Official plugins](https://github.com/jsstyles?query=jss-)

[External projects](./docs/external-projects.md)

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

### Example

```javascript
export default {
  headline: {
    fontSize: 20
  },
  title: {
    extend: 'headline',
    position: 'absolute',
    zIndex: 10,
    '&:hover': {
      background: 'red'
    }
  },
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

Converts to:

```css
.headline-jss-0 {
  font-size: 20px;
}
.title-jss-1 {
  font-size: 20px;
  position: absolute;
  z-index: 10;
}
.title-jss-1:hover {
  background: red;
}
.button-jss-2 {
  width: 100px;
}
@media (min-width: 1024px): {
  .button-jss-2 {
    width: 200px;
  }
}
```

## License

MIT

## Thanks

Thanks to [BrowserStack](https://www.browserstack.com) for providing the infrastructure that allows us to run our build in real browsers and to all awesome [contributors](https://github.com/jsstyles/jss/graphs/contributors).
