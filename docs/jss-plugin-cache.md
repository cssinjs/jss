## Enables caching JSS rules

This plugin will cache JSS rules by comparing a reference from the object.

It should be used as a **first** plugin, to bail out before any unnecessary work is done!!!

### Polyfills

1. This plugin is using a `WeakMap`. If you support browsers which do not support WeakMap, you will have to include a polyfill.

### Caveats

1.  Don't use it if you mutate your `styles`.

1.  Don't use it if you generate an huge amount of different rules. For e.g. if you generate for every request or for every user different styles. The cache memory footprint will grow proportionally to the amount of unique styles.

1.  If your `styles` objects are not static, they won't be cached. It adds a flag to the object in order to identify it and reuses the virtual rule for it then.
