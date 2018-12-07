# JSS plugin that adds units to numeric values

[![Gitter](https://badges.gitter.im/JoinChat.svg)](https://gitter.im/cssinjs/lobby)

Provide numeric values in your style definitions, and the plugin will insert the corresponding units. Defaults to px for sizes, ms for durations, and % for transform origins, and these can be customized.

Make sure you read [how to use
plugins](https://github.com/cssinjs/jss/blob/master/docs/setup.md#setup-with-custom-plugins)
in general.

## Example

```javascript
const styles = {
  container: {
    'line-height': 3,
    'font-size': 1.7,
    height: 200,
    'z-index': 1
  }
}
```

Compiles to:

```css
.container-jss-0 {
  line-height: 3;
  font-size: 1.7px;
  height: 200px;
  z-index: 1;
}
```

## Customizing defaults

```javascript
import jss from 'jss'
import defaultUnit from 'jss-default-unit'

const options = {
  'line-height': 'rem',
  'font-size': 'rem'
}

jss.use(defaultUnit(options))

const styles = {
  container: {
    'line-height': 3,
    'font-size': 1.7,
    height: 200,
    'z-index': 1
  }
}
```

Compiles to:

```css
.container-jss-0 {
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
yarn
yarn test
```

## License

MIT
