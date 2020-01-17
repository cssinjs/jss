import React from 'react'
import {renderToString} from 'react-dom/server'
import {JssProvider, SheetsRegistry} from 'react-jss'
import Button from './Button'

export default function render() {
  const sheets = new SheetsRegistry()

  const app = renderToString(
    <JssProvider registry={sheets}>
      <Button />
    </JssProvider>
  )

  return (
    '' +
    `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Server-side rendering with rehydration</title>
    <link rel="stylesheet" href="../../example.css" />
    <style type="text/css" id="server-side-styles">
      ${sheets.toString()}
    </style>
  </head>
  <body>
    <a href="https://github.com/cssinjs/examples/tree/gh-pages/react-ssr" title="View on Github" class="github-fork-ribbon" target="_blank">View on Github</a>
    <div id="app">${app}</div>
    <script src="./app.js"></script>
  </body>
</html>`
  )
}
