# jss-keyframes-helper

Helper for generating keyframes with a unique id in jss

## Installation

> yarn add jss-keyframes-helper

## Usage

```js
import keyframes from 'jss-keyframes-helper'

const animationName = keyframes({
  from: {transform: 'scale(1)'},
  to: {transform: 'scale(0)'}
})
```

The keyframes function return the name of the animation.

## Options

The keyframes function accepts a second object for some options.

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
  sheet: StyleSheet,

  // A registry to add the stylesheet to.
  registry: SheetsRegistry,
}
```
