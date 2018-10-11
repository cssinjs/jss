# JSS plugin that allows to use tc39 Observables

[![Gitter](https://badges.gitter.im/JoinChat.svg)](https://gitter.im/cssinjs/lobby)

In order to create highly dynamic animations, you may want to use streams. Take a look at the [tc39 observable proposal](https://github.com/tc39/proposal-observable).

[Sheet option](https://github.com/cssinjs/jss/blob/master/docs/js-api.md#create-style-sheet) `link: true` is required for this to function.

_Plugins are **not** applied by default to observable rules or values._

Make sure you read [how to use
plugins](https://github.com/cssinjs/jss/blob/master/docs/setup.md#setup-with-plugins)
in general.

## Observable values

```javascript
const styles = {
  button: {
    color: new Observable(observer => {
      observer.next('red')
    })
  }
}
```

```css
.button-1-2-3 {
  color: red;
}
```

## Observable rules

Similar to observable values, you can declare observable rules. Stream should contain in this case the style object. Sheet option `link: true` is required for this to function.

```javascript
const styles = {
  button: new Observable(observer => {
    observer.next({
      color: 'red',
      opacity: 1
    })
  })
}
```

```css
.button-1-2-3 {
  color: red;
  opacity: 1;
}
```

## Applying plugins

By default for performance reasons, no plugin is applied to the values or rules returned from Observables. If you want to turn on the processing, you need to pass option `process: true`.

```javascript
// Setup with particular plugins

import jss from 'jss'
import pluginObservable from 'jss-plugin-syntax-rule-value-observable'
import pluginCamelCase from 'jss-plugin-syntax-camel-case'
import pluginDefaultUnit from 'jss-plugin-syntax-default-unit'

jss.use(pluginObservable({process: true}), pluginCamelCase(), pluginDefaultUnit())
```

```javascript
// Setup with default preset

import jss from 'jss'
import preset from 'jss-preset-default'

jss.setup(
  preset({
    observable: {process: true}
  })
)
```

```javascript
const styles = {
  button: new Observable(observer => {
    observer.next({
      marginLeft: 20
    })
  })
}
```

Note, that in this case property will have dashes and value default unit.

```css
.button-1-2-3 {
  margin-left: 20px;
}
```

## Demo

[Simple](http://cssinjs.github.io/examples/observables/index.html)

## Issues

File a bug against [cssinjs/jss prefixed with \[jss-plugin-syntax-rule-value-observable\]](https://github.com/cssinjs/jss/issues/new?title=[jss-plugin-syntax-rule-value-observable]%20).

## Run tests

```bash
yarn
yarn test
```

## License

MIT
