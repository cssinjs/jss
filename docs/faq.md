# FAQ

1. Does JSS generate inline styles?

   No, JSS generates CSS.

1. Does JSS support Server-Side Rendering?

   Yes.

1. Does JSS support Critical CSS extraction?

   Yes.

1. Is it possible to fully extract CSS and use it with link tag?

   Yes. The easiest way to do so is to export styles from modules. During the build process, import those modules and use JSS to convert the styles to CSS. After that, you can save CSS to a file and bundle it up.

1. Can JSS be used with other CSS-in-JS libraries?

   Yes.

1. Does JSS has overhead?

   Yes, it is a JavaScript library, which you can use in the browser and Node. When used in the browser there is a cost regarding bundle size and runtime CSS generation. This cost usually doesn't become a problem though, because JSS is small and fast enough not to be a bottleneck of your application. Check out [tradeoffs](./tradeoffs.md) for more information.

1. Can JSS generate global selectors?

   Yes, you can use `jss-plugin-global` and `jss-plugin-nested` to generate global selectors. The latter will allow you to cascade your global selector inside of a parent selector, reducing its power to a subtree.

1. Is JSS used in production?

   Yes, JSS is used by popular, high load products, such as [Kijiji](https://kijiji.ca), [Chatgrape](https://chatgrape.com), [Nordnet Bank](https://www.nordnet.se).

   Also, it is used by the most popular React UI library - [Material-UI](https://material-ui.com), which is used by a considerable number of small and large products.

1. Is there commercial support?

   Yes, we can provide some commercial support for a particular task, limited by a few days in one chunk.
