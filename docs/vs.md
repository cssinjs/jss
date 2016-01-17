## Benefits of using JavaScript as a higher level abstraction over CSS.

1. JavaScript vs. preprocessors (stylus/less/sass)?

Those languages introduce a non-trivial amount of specific knowledge one needs to learn. They all come with their own syntaxes for variables, functions, mixings, extends and other helper function. At the same time there is nothing they can do, but JavaScript can't.

Preprocessors generate plain CSS on the server, which means they have a bunch of disadvantages: generated code size, inability to access constants.

1. JavaScript vs. css-modules

While css-modules can be a nice solution when you just want to have a better CSS, it doesn't give you the same abilities for code reuse and computation as JavaScript. Every feature added to css-modules will separate them from CSS and lead to the same problem we already have with other preprocessors.

1. Style sheets vs. inline styles

Style sheets independent of how they have been generated have one advantage: they are static and easily cachable, while inline styles are a good fit for dynamic style changes like animations.

