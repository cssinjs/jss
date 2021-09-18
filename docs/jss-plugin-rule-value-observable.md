## Enables TC39 Observables

To create highly dynamic animations, you may want to use streams. Take a look at the [tc39 observable proposal](https://github.com/tc39/proposal-observable).

[Sheet option](https://github.com/cssinjs/jss/blob/master/docs/jss-api.md#create-style-sheet) `link: true` is required for this to function.

### Observable values

```javascript
import {Observable} from 'rxjs'

const styles = {
  button: {
    color: new Observable((observer) => {
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

Similar to observable values, you can declare "observable" rules. A stream should contain in this case the style object. Sheet option `link: true` is required for this to function.

```javascript
import {Observable} from 'rxjs'

const styles = {
  button: new Observable((observer) => {
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

By default, the plugin gets applied to the values or rules returned from Observables. If you want to turn the processing of for performance reasons, you can pass an option `process: false`.

```javascript
import jss from 'jss'
import pluginObservable from 'jss-plugin-rule-value-observable'
import pluginCamelCase from 'jss-plugin-camel-case'
import pluginDefaultUnit from 'jss-plugin-default-unit'

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

### Demo

[CodeSandbox](//codesandbox.io/s/github/cssinjs/jss/tree/master/examples/plugins/jss-plugin-rule-value-observable?fontsize=14)
