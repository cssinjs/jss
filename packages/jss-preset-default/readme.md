![JSS logo](https://avatars1.githubusercontent.com/u/9503099?v=3&s=60)

## Default preset for JSS with selected plugins.

Presets allows to setup JSS quickly with default settings and plugins.

Make sure you read [how to use
plugins](https://github.com/cssinjs/jss/blob/master/docs/setup.md#setup-with-plugins)
in general.

[JSS](https://github.com/cssinjs/jss)

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/cssinjs/jss)

## API

`preset()`

Preset exports a default function which accepts options. Options is a map of plugin name in camel case and plugin options as value.

It returns a JSS options object, which can be passed to JSS constructor or the `setup`.

```javascript

preset({somePlugin: options})

```

## Setup global JSS instance

```javascript
import jss from 'jss'
import preset from 'jss-preset-default'

jss.setup(preset())
```

## Setup own JSS instance

```javascript
import {create} from 'jss'
import preset from 'jss-preset-default'

const jss = create(preset())
```

## Issues

File a bug against [cssinjs/jss prefixed with \[jss-preset-default\]](https://github.com/cssinjs/jss/issues/new?title=[jss-preset-default]%20).

## License

MIT
