# Server-Side Rendering

1. Render the document.

   The only JSS specific thing you need to know is the [Style Sheets registry](./js-api.md#style-sheets-registry). It will allow you to get all attached sheets as a CSS string. Rendering of the document depends on the framework you use, here is an [example in react](https://github.com/cssinjs/examples/blob/gh-pages/react-ssr/src/server.js).

2. Rehydration.

   Once JS on the client is loaded, components initialized and your JSS styles are regenerated, it's a good time to remove server-side generated style tag in order to avoid side-effects, [example in react](https://github.com/cssinjs/examples/blob/gh-pages/react-ssr/src/client.js).

[Here](http://cssinjs.github.io/examples/react-ssr/dist/index.html) is a live demo with react, ssr and react-jss.
