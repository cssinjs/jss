# jss-keyframes-helper

Helper for generating keyframes with a unique id in JSS

## Installation

> npm i jss-keyframes-helper

## Usage

```js
import keyframes from 'jss-keyframes-helper'

const animationName = keyframes({
  from: {transform: 'scale(1)'},
  to: {transform: 'scale(0)'}
})
```

The keyframes function returns the name of the animation.

## Options

The keyframes function accepts a second object for some configuration.

```js
type Options = {
  // Jss instance to be used
  // It will generate a separate stylesheet for every instance
  jss: Jss
  // A name to better identify the animation
  // Example: { name: 'button' } would return button-1
  // This option will default to animation
  name: string
  // A StyleSheet to be used for adding the keyframes to instead of the created one.
  // This will not add the stylesheet to the internally used SheetsRegistry of this package.
  // You will need to add it to your own SheetsRegistry when doing SSR.
  sheet: StyleSheet,
}
```

## SSR with React

Because we may create multiple stylesheets for different jss instances, we add those to an internal SheetsRegistry which you can import.
Keyframes should be static, so you don't need to recreate them for every requests and reuse them between requests.

Example:

```js
import {renderToString} from 'react-dom/server'
import {JssProvider, SheetsRegistry} from 'react-jss'
import MyApp from './MyApp'
import {sheetsRegistry} from 'jss-keyframes-helper'

// This will collect all of the StyleSheets which have been added until now.
// Only keyframes of actually imported files will be added though!
const stylesheets = sheetsRegistry.toString()

export default function render(req, res) {
  const sheets = new SheetsRegistry()
  const body = renderToString(
    <JssProvider registry={sheets}>
      <MyApp />
    </JssProvider>
  )

  // You will need to create two stylesheets in your head now.
  return res.send(
    renderToString(
      <html>
        <head>
          <style type="text/css">{stylesheets.toString()}</style>
          <style type="text/css">{sheets.toString()}</style>
        </head>
        <body>{body}</body>
      </html>
    )
  )
}
```
