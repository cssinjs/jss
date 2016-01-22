## JSS

[![Codeship](https://codeship.com/projects/a63ccb40-5d57-0133-fdca-6a352dca42a3/status?branch=master)](https://www.codeship.io/projects/111070)
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/jsstyles/jss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![bitHound Score](https://www.bithound.io/jsstyles/jss/badges/score.svg)](https://www.bithound.io/jsstyles/jss)

[JSS is a higher level abstraction](https://medium.com/@oleg008/jss-is-css-d7d41400b635) over CSS. It allows you to describe styles in JSON and leverage the [power of JavaScript](./docs/vs.md). It generates style sheets at runtime or [server-side](./docs/server-side.md) and solves a [number of CSS issues](./docs/solved-issues.md).

You can use [JSS with React](https://github.com/jsstyles/react-jss), or with any other js library. It is small, modular and extensible via plugins API.

[**Full documentation**](./docs/index.md)

### When should I use it?

- You build a JavaScript heavy application.
- You use components based architecture.
- You build a reusable UI library.
- You need a conflict free CSS (external content, third-party UI components ...).
- You need code sharing between js and css.
- Minimal download size is important to you.
- Robustness and code reuse is important to you.
- Ease of maintenance is important to you.

### Example.

[Online examples](http://jsstyles.github.io/examples/index.html).

- style.js
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

- app.js
```javascript
import jss from 'jss'
import style from './style.js'

// Creates the style element and inserts it into DOM if DomRenderer is used.
jss.createStyleSheet(style).attach()
```

Generated style:

```css
<style>
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
</style>
```

## Install

```bash
npm i jss
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

## License

MIT

## Thanks

Thanks to [BrowserStack](https://www.browserstack.com) for providing the infrastructure that allows us to run our build in real browsers and to all awesome [contributors](https://github.com/jsstyles/jss/graphs/contributors).
