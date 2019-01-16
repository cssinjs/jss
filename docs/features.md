# Features

1. Real CSS.

   JSS generates actual CSS, not Inline Styles. It supports every existing CSS feature. CSS rules are created once and reused across the elements using its class name in contrary to Inline Styles. Also, when DOM elements get updated, previously created CSS rules are applied.

1. Collision-free selectors.

   JSS generates unique class names by default. It allows avoiding the typical CSS problem, where everything is global by default. It completely removes the need for naming conventions.

1. Code reuse.

   Using JavaScript as a host language gives us an opportunity to reuse CSS rules in a way that is not possible with regular CSS. You can leverage JavaScript modules, variables, functions, math operations and more. If done right, it can still be fully declarative.

1. Ease of removal and modification.

   Explicit usage of CSS rules allows you to track them down to the consumer and decide if it can be safely removed or modified.

1. Dynamic styles.

   Using JavaScript functions and Observables makes it possible to dynamically generate styles in the browser, giving you an opportunity to access your application state, browser APIs or remote data for styling. You can not only define styles once but also update them at any point in time in an efficient way.

1. User-controlled animations.

   JSS handles CSS updates so efficiently that you can create complex animations with it. Using function values, Observables and combining them with CSS transitions will give you maximum performance for user-controlled animations. For predefined animations, it is still better to use @keyframes and transitions, because they will unblock the JavaScript thread completely.

1. Critical CSS.

   To optimize time to first paint, you can use server-side rendering and extract critical CSS. You can couple the rendering of CSS with the rendering of HTML so that no unused CSS gets generated. It will result in a minimal critical CSS extracted during server-side rendering and allow you to inline it.

1. Plugins.

   JSS core implements a plugin-based architecture. It allows you to create custom plugins which can implement custom syntax or other powerful abilities. JSS has many official plugins, which can be installed individually or using a default preset. A good example of a community plugin is [jss-rtl](https://yarnpkg.com/en/package/jss-rtl).

1. Expressive syntax.

   Thanks to various plugins, JSS allows you to have nesting, global selectors, composition with existing global class names. E.g. `jss-plugin-expand` allows you to express properties like `box-shadow` even in a more readable way than it is possible with CSS. You can also use template strings if you want to copy-paste styles directly from the browser dev tools.

1. Full isolation.

   Another useful plugin example is `jss-plugin-isolate`, which allows you to isolate your elements from global cascading rules fully and potentially overwriting unwanted properties. Especially useful when creating a widget that is supposed to render inside of a third-party document.

1. React integration.

   The React-JSS package provides some additional features:

   - Dynamic Theming - allows context based theme propagation and runtime updates.
   - Critical CSS extraction - only CSS from rendered components gets extracted.
   - Lazy evaluation - Style Sheets get created when a component gets mounted.
   - The static part of a Style Sheet gets shared between all elements.
   - Function values and rules are updated automatically with props as an argument.

1. JavaScript build pipeline.

   There is no need for additional build pipeline configuration for CSS. Whatever tool you choose to build your JavaScript, it will just work with JSS.
