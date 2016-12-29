# Default preset for JSS with selected plugins

Preset allows to setup [JSS](https://github.com/cssinjs/jss) quickly with default settings and a [number of plugins](https://github.com/cssinjs/jss-preset-default/blob/master/package.json#L50) so that you don't need to learn how to [setup plugins](https://github.com/cssinjs/jss/blob/master/docs/setup.md#setup-with-plugins).


[![Gitter](https://badges.gitter.im/JoinChat.svg)](https://gitter.im/cssinjs/jss)

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
