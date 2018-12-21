# JSS plugin that allows to use functions for dynamic styles

[![Gitter](https://badges.gitter.im/JoinChat.svg)](https://gitter.im/cssinjs/lobby)

If you want dynamic behavior for your Style Sheet, you can use functions as a value which return the actual value or a rule. If function returns `null|undefined|false` - property will be removed. Use [sheet.update(data)](https://github.com/cssinjs/jss/blob/master/docs/js-api.md#update-function-values) in order to pass the data object.

[Sheet option](https://github.com/cssinjs/jss/blob/master/docs/js-api.md#create-style-sheet) `link: true` is required for this to function.

_Plugins are applied by default to function rules or values._

Make sure you read [how to use
plugins](https://github.com/cssinjs/jss/blob/master/docs/setup.md#setup-with-plugins)
in general.

## Function values

```javascript
import jss from 'jss'

const styles = {
  button: {
    color: data => data.color
  }
}

const sheet = jss.createStyleSheet(styles, {link: true}).attach()

sheet.update({color: 'red'})
```

```css
.button-1-2-3 {
  color: red;
}
```

## Function rules

Similar to function values, you can use a function to return a dynamic style object. Use [sheet.update(data)](https://github.com/cssinjs/jss/blob/master/docs/js-api.md#update-function-values) in order to pass the data object. Sheet option `link: true` is required for this to function.

```javascript
const styles = {
  button: data => ({
    display: 'flex',
    color: data.color
  })
}
```

## Support of "!important"

To use the `!important` modifier with function values, you must use [array syntax](https://github.com/cssinjs/jss/blob/master/docs/json-api.md#alternative-for-space-and-comma-separated-values):

```javascript
const styles = {
  button: {
    color: data => [[data.color], '!important']
  }
}
```

## Demo

[Simple](http://cssinjs.github.io/examples/function-values/index.html)

## Issues

File a bug against [cssinjs/jss prefixed with \[jss-plugin-rule-value-function\]](https://github.com/cssinjs/jss/issues/new?title=[jss-plugin-rule-value-function]%20).

## Run tests

```bash
yarn
yarn test
```

## License

MIT
