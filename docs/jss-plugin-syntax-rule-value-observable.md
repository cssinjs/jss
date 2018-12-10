## Enables TC39 Observables

In order to create highly dynamic animations, you may want to use streams. Take a look at the [tc39 observable proposal](https://github.com/tc39/proposal-observable).

[Sheet option](https://github.com/cssinjs/jss/blob/master/docs/js-api.md#create-style-sheet) `link: true` is required for this to function.

_Plugins are **not** applied by default to observable rules or values._

### Observable values

```javascript
import {Observable} from 'rxjs'

const styles = {
  button: {
    color: new Observable(observer => {
      observer.next('red')
    })
  }
}
```

```css
.button-0 {
  color: red;
}
```

### Observable rules

Similar to observable values, you can declare observable rules. Stream should contain in this case the style object. Sheet option `link: true` is required for this to function.

```javascript
import {Observable} from 'rxjs'

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
.button-0 {
  color: red;
  opacity: 1;
}
```

### Without processing overhead

By default plugin are applied to the values or rules returned from Observables. If you want to turn the processing of for performance reasons, you can pass an option `process: false`.

```javascript
import jss from 'jss'
import pluginObservable from 'jss-plugin-syntax-rule-value-observable'
import pluginCamelCase from 'jss-plugin-syntax-camel-case'
import pluginDefaultUnit from 'jss-plugin-syntax-default-unit'

jss.use(pluginObservable({process: false}), pluginCamelCase(), pluginDefaultUnit())
```

```javascript
import jss from 'jss'
import preset from 'jss-preset-default'

jss.setup(
  preset({
    observable: {process: false}
  })
)
```
