# jss-starter-kit:🚰 the whole kitchen sink

[![Gitter](https://badges.gitter.im/JoinChat.svg)](https://gitter.im/cssinjs/lobby)

The `jss-starter-kit` combines all of the other [packages](https://github.com/cssinjs/jss/tree/master/packages) into a single bundle, to make it easy to import directly into a playground like Codepen, or a local HTML file.

:warning: This bundle includes every JSS package, unminified. It's great for experimenting, but not suitable for production deployment.

## Quick start

There's an instance of JSS already set up with all of the default plugins, exported as `jss`.

```javascript
import {jss} from 'https://unpkg.com/jss-starter-kit'

// Notice that you can use camel-cased style keys here, because
// the default preset include jss-plugin-camel-case.  If you want to use
// jss in your production application, you'll need to manually install the
// plugins you need.
const {classes} = jss
  .createStyleSheet({
    wrapper: {
      padding: 40,
      background: '#f7df1e',
      textAlign: 'center'
    },
    title: {
      font: {
        size: 40,
        weight: 900
      },
      color: '#24292e'
    },
    link: {
      color: '#24292e',
      '&:hover': {
        opacity: 0.5
      }
    }
  })
  .attach()

document.body.innerHTML = `
  <div class="${classes.wrapper}">
    <h1 class="${classes.title}">Hello JSS!</h1>
    <a
      class=${classes.link}
      href="http://cssinjs.org/"
      traget="_blank"
    >
      See docs
    </a>
  </div>
`
```

## Plugins

[Every plugin shipped by JSS](https://github.com/cssinjs/jss/tree/master/packages) is included here. See [`index.js`](https://github.com/cssinjs/jss/blob/master/packages/jss-starter-kit/src/index.js) to see the names they are exported as.

## Issues

File a bug against [cssinjs/jss prefixed with \[jss-starter-kit\]](https://github.com/cssinjs/jss/issues/new?title=[jss-starter-kit]%20).

## License

MIT
