## Enables functions for dynamic styles

If you want dynamic behavior for your Style Sheet, you can use functions as a value which returns the actual value or a rule. If function returns `null|undefined|false` - property will be removed. Use [sheet.update(data)](https://github.com/cssinjs/jss/blob/master/docs/jss-api.md#update-function-values) in order to pass the data object.

[Sheet option](https://github.com/cssinjs/jss/blob/master/docs/jss-api.md#create-style-sheet) `link: true` is required for this to function.

_Plugins are applied by default to function rules or values._

### Function values

```javascript
const styles = {
  button: {
    color: (data) => data.color
  }
}
```

```css
.button-0 {
  color: red;
}
```

### Function rules

Similar to function values, you can use a function to return a dynamic style object. Use [sheet.update(data)](https://github.com/cssinjs/jss/blob/master/docs/jss-api.md#update-function-values) in order to pass the data object. Sheet option `link: true` is required for this to function.

```javascript
const styles = {
  button: (data) => ({
    display: 'flex',
    color: data.color
  })
}
```

_Function values inside function rules are not supported._

### Support of "!important"

To use the `!important` modifier with function values, you must use [array syntax](https://github.com/cssinjs/jss/blob/master/docs/jss-syntax.md#alternative-for-space-and-comma-separated-values):

```javascript
const styles = {
  button: {
    color: (data) => [[data.color], '!important']
  }
}
```

### Updating

```javascript
import jss from 'jss'

// Note that `link` option is required.
const sheet = jss
  .createStyleSheet(
    {
      /* styles */
    },
    {link: true}
  )
  .attach()

sheet.update({color: 'red'})
```

### Demo

[CodeSandbox](//codesandbox.io/s/github/cssinjs/jss/tree/master/examples/plugins/jss-plugin-rule-value-function?fontsize=14)
