## Server-Side Rendering

1. Render the document.

  The only JSS specific thing you need to know is style sheets registry. To get all created styles as a string - `jss.sheets.toString()`. Rendering of the document depends on framework you use, here is an [example in react](https://github.com/cssinjs/examples/blob/gh-pages/react-ssr/src/server.js).

2. Rehydration.

  Once js on the client is loaded, components initialized and your jss styles are regenerated, it's a good time to remove server-side generated style tag in order to avoid side-effects, [example in react](https://github.com/cssinjs/examples/blob/gh-pages/react-ssr/src/client.js).


[Here](http://cssinjs.github.io/examples/react-ssr/dist/index.html) is a live demo with react, ssr and react-jss.

