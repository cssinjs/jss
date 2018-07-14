# JSS plugin that adds units to numeric values

[![Gitter](https://badges.gitter.im/JoinChat.svg)](https://gitter.im/cssinjs/lobby)

Provide plain numeric values in your JSS style definitions, and the plugin will insert the apposite units. Defaults to `px` for sizes, `ms` for durations, and `%` for transform origins, and these can be customized easily (see Usage Example).

Make sure you read [how to use
plugins](https://github.com/cssinjs/jss/blob/master/docs/setup.md#setup-with-plugins)
in general.

## Setup

```javascript
import jss from 'jss'
import defaultUnit from 'jss-default-unit'

// Optionally you can customize default units.
const options = {
  'line-height': 'rem',
  'font-size': 'rem'
}

jss.use(defaultUnit(options))
```

## Example

```javascript
const styles = {
  container: {
    'line-height': 3,
    'font-size': 1.7,
    'height': 200,
    'z-index': 1
  }
}
```

Compiles to:

```css
.container-sdf345 {
  line-height: 3rem;
  font-size: 1.7rem;
  height: 200px;
  z-index: 1;
}
```

## Demo

[Simple](http://cssinjs.github.io/examples/plugins/jss-default-unit/simple/index.html)

## Issues

File a bug against [cssinjs/jss prefixed with \[jss-default-unit\]](https://github.com/cssinjs/jss/issues/new?title=[jss-default-unit]%20).

## Run tests

```bash
npm i
npm run test
```

## License

MIT
