## Default units for numeric values

Provide numeric values in your style definitions, and the plugin will insert the corresponding units. Defaults to px for sizes, ms for durations, and % for transform origins and these can be customized.

```javascript
const styles = {
  button: {
    'line-height': 3,
    'font-size': 1.7,
    height: 200,
    'z-index': 1
  }
}
```

Compiles to:

```css
.button-0 {
  line-height: 3;
  font-size: 1.7px;
  height: 200px;
  z-index: 1;
}
```

### Customizing defaults

```javascript
import jss from 'jss'
import defaultUnit from 'jss-plugin-default-unit'

const options = {
  'line-height': 'rem',
  'font-size': 'rem',
  width: (val) => `${val / 2}px`
}

jss.use(defaultUnit(options))

const styles = {
  container: {
    'line-height': 3,
    'font-size': 1.7,
    height: 200,
    width: 200,
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
  width: 100px;
  z-index: 1;
}
```

### Demo

[CodeSandbox](//codesandbox.io/s/github/cssinjs/jss/tree/master/examples/plugins/jss-plugin-default-unit?fontsize=14)
