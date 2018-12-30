## Default preset for JSS with selected plugins

Preset allows a quick setup with default settings and a [default plugins](https://github.com/cssinjs/jss/blob/master/packages/jss-preset-default/package.json#L44) so that you don't need to [setup plugins](https://github.com/cssinjs/jss/blob/master/docs/setup.md#setup-with-custom-plugins) manually.

### API

`preset()`

It exports a default function which accepts options. Options is a map of plugin name in camel case and plugin options as value.

It returns a JSS options object, which you can pass to JSS constructor or the `setup`.

```javascript
import preset from 'jss-preset-default'

preset({somePlugin: {}})
```

### Setup global JSS instance

```javascript
import jss from 'jss'
import preset from 'jss-preset-default'

jss.setup(preset())
```

### Setup custom JSS instance

```javascript
import {create} from 'jss'
import preset from 'jss-preset-default'

const jss = create(preset())
```
