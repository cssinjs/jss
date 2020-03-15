import React from 'react'
import {renderToString} from 'react-dom/server'
import {JssProvider, SheetsRegistry} from 'react-jss'
import Button from './src/Button'

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
        <style type="text/css" id="server-side-styles">
          ${sheets.toString()}
        </style>
      </head>
      <body>
        <div id="app">${app}</div>
        <script src="./client.js"></script>
      </body>
    </html>`
  )
}
