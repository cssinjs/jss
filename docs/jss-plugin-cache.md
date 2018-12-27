## Enables caching JSS rules

This plugin will cache JSS rules by comparing a reference from the object.

It should be used as a **first** plugin, to bail out before doing any unnecessary work!!!

### Polyfills

1. This plugin is using a `WeakMap`. If you support browsers which do not support WeakMap, you will have to include a polyfill.

### Caveats

1.  Don't use it if you mutate your `styles`.

1.  Don't use it if you generate a huge amount of different rules. E.g., if you generate for every request or every user, different styles. The cache memory footprint will grow proportionally to the number of unique styles.

1.  If your `styles` objects are not static, they won't get cached. It adds a flag to the object to identify it and reuses the virtual rule for it then.
