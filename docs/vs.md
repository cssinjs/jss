## Benefits of using JavaScript as a higher level abstraction over CSS.

1. JavaScript vs. preprocessors (stylus/less/sass)?

  Those languages introduce a non-trivial amount of specific knowledge one needs to learn. They all come with their own syntaxes for variables, functions, mixins, extends and other helper functions. At the same time there is nothing they can do JavaScript can't.

  Preprocessors generate plain CSS on the server, which means they have a bunch of disadvantages:

  - generated code size
  - no easy access to constants
  - no easy way to modify styles according the environment requirements at runtime
  - no easy way to generate styles at runtime based on existing once

1. JavaScript vs. css-modules

  While css-modules can be a nice solution when you just want to have a better CSS, it doesn't give you the same abilities for code reuse and computation as JavaScript. Every feature added to css-modules will separate them from CSS and lead to the same problem we already have with other preprocessors.

1. Style sheets vs. inline styles

  Style sheets independent of how they have been generated have one advantage: they are static and easily cachable, while inline styles are a good fit for dynamic style changes like animations. Inline styles miss a number of features: media queries, keyframes, pseudo classes, fallback props. They are also [slower](./performance.md) than style sheets and require even more computational power when created at render time. 
  
Related articles:

https://byjoeybaker.com/react-inline-styles

https://medium.com/@dbow1234/component-style-b2b8be6931d3#.uw7vpbssl

