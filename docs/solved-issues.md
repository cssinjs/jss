## CSS issues JSS solves.

1. Global namespace.

  CSS has just one global namespace. It is inpossible to avoid selector collisions in non-trivial applications. Naming conventions like BEM might help within one project, but will not when integrating third-party code.
  
  JSS generates unique class names by default when it compiles JSON representation to CSS.

1. Slow selectors.

  Because JSS rules are collision free, there is no need to write deeply netsted selectors. This leads to stable [performance](./performance.md) at scale.

1. Code reuse.

  CSS is limited to applying multiple selectors to the same node in its code reuse capabilities.
  JSS allows you to compose rules from multiple sources. You can reuse existing rules, you can use functions to generate rules and to calculate values. This way we can avoid repeatitions in a very explicit way and reduce download size.

1. Vendor Prefixing.

  Using plain CSS you need to download all the vendor prefixed properties and values. This increases overall CSS size.
  Using JSS vendor-prefixer plugin, prefixes added at runtime very efficiently, only for the required browser and do *not* increase download size.

1. Refactoring

  Thanks to javascript modules and explicit code reuse, we can quickly locate dependencies during refactoring.
