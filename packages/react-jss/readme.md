# JSS integration with React

[![Gitter](https://badges.gitter.im/JoinChat.svg)](https://gitter.im/cssinjs/lobby)

React-JSS provides components for [JSS](https://github.com/cssinjs/jss) as a layer of abstraction. JSS and the [default preset](https://github.com/cssinjs/jss-preset-default) are already built in! Try it out in the [playground](https://codesandbox.io/s/j3l06yyqpw).

Benefits compared to lower level core:

- Theming support.
- Critical CSS extraction.
- Lazy evaluation - sheet is created only when the component will mount.
- Auto attach/detach - sheet will be rendered to the DOM when the component is about to mount, and will be removed when no element needs it.
- A Style Sheet gets shared between all elements.
- Function values and rules are updated automatically with props.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
  - [Basic](#basic)
  - [Dynamic Values](#dynamic-values)
  - [Theming](#theming)
  - [Server-side rendering](#server-side-rendering)
  - [React tree traversing](#react-tree-traversing)
  - [Reuse styles in different components](#reuse-styles-in-different-components)
  - [The inner component](#the-inner-component)
  - [The inner ref](#the-inner-ref)
  - [Custom setup](#custom-setup)
  - [Decorators](#decorators)
- [Contributing](#contributing)
- [License](#license)

## Install

```
npm install --save react-jss
```

```
yarn add react-jss
```

## Usage

React-JSS wraps your component with a [higher-order component](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750).
It injects a `classes` prop, which is a simple map of rule names and generated class names. It can act both as a simple wrapping function and as an [ES7 decorator](https://github.com/wycats/javascript-decorators).

Try it out in the [playground](https://codesandbox.io/s/j3l06yyqpw).

### Basic

```javascript
import React from 'react'
import {render} from 'react-dom'
// Import React-JSS
import injectSheet from 'react-jss'

// Create your Styles. Remember, since React-JSS uses the default preset,
// most plugins are available without further configuration needed.
const styles = {
  myButton: {
    color: 'green',
    margin: {
      // jss-expand gives more readable syntax
      top: 5, // jss-default-unit makes this 5px
      right: 0,
      bottom: 0,
      left: '1rem'
    },
    '& span': {
      // jss-nested applies this to a child span
      fontWeight: 'bold' // jss-camel-case turns this into 'font-weight'
    }
  },
  myLabel: {
    fontStyle: 'italic'
  }
}

// Define the component using these styles and pass it the 'classes' prop.
// Use this to assign scoped class names.
const Button = ({classes, children}) => (
  <button className={classes.myButton}>
    <span className={classes.myLabel}>{children}</span>
  </button>
)

// Finally, inject the stylesheet into the component.
const StyledButton = injectSheet(styles)(Button)
// You can also export the component with
// export default injectSheet(styles)(Button)

const App = () => <StyledButton>Submit</StyledButton>

render(<App />, document.getElementById('root'))
```

The above code will compile to

```html
<div id="root">
  <button class="Button-myButton-1-25">
    <span class="Button-myLabel-1-26">
      Submit
    </span>
  </button>
</div>
```

and

```css
.Button-myButton-1-25 {
  color: green;
  margin: 5px 0 0 1rem;
}
.Button-myButton-1-25 span {
  font-weight: bold;
}
.Button-myLabel-1-26 {
  font-style: italic;
}
```

### Dynamic values

You can use [function values](https://github.com/cssinjs/jss/blob/master/docs/json-api.md#function-values), function rules and observables out of the box. Function values and function rules will receive a props object once the component receives new props or mounts for the first time.

There are 2 caveats:

1.  Static properties are rendered first, so function values will have higher source order specificity.
1.  They have a [number of limitations](https://github.com/cssinjs/jss/issues/682) regarding the syntax, since they don't run through all plugins right now.

```javascript
const styles = {
  myButton: {
    padding: props => props.spacing
  },
  myLabel: props => ({
    display: 'block',
    color: props.labelColor,
    fontWeight: props.fontWeight,
    fontStyle: props.fontStyle
  })
}

const Button = ({classes, children}) => (
  <button className={classes.myButton}>
    <span className={classes.myLabel}>{children}</span>
  </button>
)

Button.defaultProps = {
  spacing: 10,
  fontWeight: 'bold',
  labelColor: 'red'
}

const StyledButton = injectSheet(styles)(Button)

const App = () => <StyledButton fontStyle="italic">Submit</StyledButton>
```

The above code will compile to

```html
<div id="root">
  <button class="Button-myButton-1-25">
    <span class="Button-myLabel-1-26">
      Submit
    </span>
  </button>
</div>
```

and

```css
.Button-myButton-1-25 {
  padding: 10px;
}
.Button-myLabel-1-26 {
  display: block;
  color: red;
  font-weight: bold;
  font-style: italic;
}
```

### Theming

The idea is that you define a theme, wrap your application with `ThemeProvider` and pass the `theme` to `ThemeProvider`. ThemeProvider will pass it over `context` to your styles creator function and to your props. After that you may change your theme, and all your components will get the new theme automatically.

Under the hood `react-jss` uses the unified CSSinJS `theming` solution for React. You can find [detailed docs in its repo](https://github.com/iamstarkov/theming).

Using `ThemeProvider`:

- It has a `theme` prop which should be an `object` or `function`:
  - If it is an `Object` and used in a root `ThemeProvider` then it's intact and being passed down the react tree.
  - If it is `Object` and used in a nested `ThemeProvider` then it's being merged with theme from a parent `ThemeProvider` and passed down the react tree.
  - If it is `Function` and used in a nested `ThemeProvider` then it's being applied to the theme from a parent `ThemeProvider`. If result is an `Object` it will be passed down the react tree, throws otherwise.
- `ThemeProvider` as every other component can render only single child, because it uses `React.Children.only` in render and throws otherwise.
- [Read more about `ThemeProvider` in `theming`'s documentation.](https://github.com/iamstarkov/theming#themeprovider)

```javascript
import React from 'react'
import injectSheet, {ThemeProvider} from 'react-jss'

const Button = ({classes, children}) => (
  <button className={classes.button}>
    <span className={classes.label}>{children}</span>
  </button>
)

const styles = theme => ({
  button: {
    background: theme.colorPrimary
  },
  label: {
    fontWeight: 'bold'
  }
})

const StyledButton = injectSheet(styles)(Button)

const theme = {
  colorPrimary: 'green'
}

const App = () => (
  <ThemeProvider theme={theme}>
    <StyledButton>I am a button with green background</StyledButton>
  </ThemeProvider>
)
```

In case you need to access the theme but not render any CSS, you can also use `withTheme`. It is a Higher-order Component factory which takes a `React.Component` and maps the theme object from context to props. [Read more about `withTheme` in `theming`'s documentation.](https://github.com/iamstarkov/theming#withthemecomponent)

```javascript
import React from 'react'
import injectSheet, {withTheme} from 'react-jss'

const Button = withTheme(({theme}) => <button>I can access {theme.colorPrimary}</button>)
```

_Namespaced_ themes can be used so that a set of UI components should not conflict with another set of UI components from a different library using also `react-jss`.

```javascript
import {createTheming} from 'react-jss'

// Creating a namespaced theming object.
const theming = createTheming('__MY_NAMESPACED_THEME__')

const {ThemeProvider: MyThemeProvider} = theming

const styles = theme => ({
  button: {
    background: theme.colorPrimary
  }
})

const theme = {
  colorPrimary: 'green'
}

const Button = ({classes, children}) => (
  <button className={classes.button}>
    {children}
  </button>
)

// Passing namespaced theming object inside injectSheet options.
const StyledButton = injectSheet(styles, { theming })(Button)

// Using namespaced ThemeProviders - they can be nested in any order
const App = () => (
  <OtherLibraryThemeProvider theme={otherLibraryTheme}>
    <OtherLibraryComponent />
    <MyThemeProvider theme={theme}>
      <StyledButton>Green Button</StyledButton>
    </MyThemeProvider>
  <OtherLibraryThemeProvider>
)
```

### Server-side rendering

After the application is mounted, you should remove the style tag used by critical CSS rendered server-side.

```javascript
import {renderToString} from 'react-dom/server'
import {JssProvider, SheetsRegistry} from 'react-jss'
import MyApp from './MyApp'

export default function render(req, res) {
  const sheets = new SheetsRegistry()

  const body = renderToString(
    <JssProvider registry={sheets}>
      <MyApp />
    </JssProvider>
  )

  // Any instances of `injectSheet` within `<MyApp />` will have gotten sheets
  // from `context` and added their Style Sheets to it by now.

  return res.send(
    renderToString(
      <html>
        <head>
          <style type="text/css">{sheets.toString()}</style>
        </head>
        <body>{body}</body>
      </html>
    )
  )
}
```

### React tree traversing

For traversing the React tree outside of the HTML rendering, you should add `disableStylesGeneration` property.

```javascript
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import bootstrapper from 'react-async-bootstrapper'

import {JssProvider} from 'react-jss'
import MyApp from './MyApp'

const App = ({disableStylesGeneration}) => (
  <JssProvider disableStylesGeneration>
    <MyApp />
  </JssProvider>
)

async function main() {
  await bootstrapper(<App disableStylesGeneration />)
  ReactDOM.render(<App />, document.getElementById('root'))
}

main()
```

### Reuse styles in different components

In order to reuse the same styles **and** the same generated style sheet between 2 entirely different and unrelated components, we suggest extracting a renderer component and reusing that.

```javascript
const styles = {
  button: {
    color: 'red'
  }
}
const RedButton = injectSheet(styles)(({classes, children}) => (
  <button className={classes.button}>{children}</button>
))

const SomeComponent1 = () => (
  <div>
    <RedButton>My red button 1</RedButton>
  </div>
)

const SomeComponent2 = () => (
  <div>
    <RedButton>My red button 2</RedButton>
  </div>
)
```

Alternatively you can create own Style Sheet and use the `composes` feature. Also you can mix in a common styles object, but take into account that it can increase the overall CSS size.

### The inner component

```es6
const InnerComponent = () => null
const StyledComponent = injectSheet(styles, InnerComponent)
console.log(StyledComponent.InnerComponent) // Prints out the inner component.
```

### The inner ref

In order to get a `ref` to the inner element, use the `innerRef` prop.

```es6
const InnerComponent = () => null
const StyledComponent = injectSheet({})(InnerComponent)

<StyledComponent innerRef={(ref) => {console.log(ref)}} />
```

### Custom setup

If you want to specify a JSS version and plugins to use, you should create your [own JSS instance](https://github.com/cssinjs/jss/blob/master/docs/js-api.md#create-an-own-jss-instance), [setup plugins](https://github.com/cssinjs/jss/blob/master/docs/setup.md#setup-with-plugins) and pass it to `JssProvider`.

```javascript
import {create as createJss} from 'jss'
import {JssProvider} from 'react-jss'
import vendorPrefixer from 'jss-vendor-prefixer'

const jss = createJss()
jss.use(vendorPrefixer())

const Component = () => (
  <JssProvider jss={jss}>
    <App />
  </JssProvider>
)
```

You can also access the JSS instance being used by default.

```javascript
import {jss} from 'react-jss'
```

### Multi-tree setup

In case you render multiple react rendering trees in one application, you will get class name collisions, because every JssProvider rerender will reset the class names generator. If you want to avoid this, you can share the class names generator between multiple JssProvider instances.

**Note**: in case of SSR, make sure to create a new generator for **each** request. Otherwise class names will become indeterministic and at some point you may run out of max safe integer numbers.

```javascript
import {createGenerateClassName, JssProvider} from 'react-jss'

const generateClassName = createGenerateClassName()

const Component = () => (
  <div>
    <JssProvider generateClassName={generateClassName}>
      <App1 />
    </JssProvider>
    <JssProvider generateClassName={generateClassName}>
      <App2 />
    </JssProvider>
  </div>
)
```

You can also additionally use the `classNamePrefix` prop in order to add the app/subtree name to each class name.
This way you can see which app generated a class name in the DOM view.

```javascript
import {JssProvider} from 'react-jss'

const Component = () => (
  <div>
    <JssProvider classNamePrefix="App1-">
      <App1 />
    </JssProvider>
    <JssProvider classNamePrefix="App2-">
      <App2 />
    </JssProvider>
  </div>
)
```

### Decorators

_Beware that [decorators are stage-2 proposal](https://tc39.github.io/proposal-decorators/), so there are [no guarantees that decorators will make its way into language specification](https://tc39.github.io/process-document/). Do not use it in production. Use it at your own risk and only if you know what you are doing._

You will need [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy).

```javascript
import React, {Component} from 'react'
import injectSheet from 'react-jss'

const styles = {
  button: {
    backgroundColor: 'yellow'
  },
  label: {
    fontWeight: 'bold'
  }
}

@injectSheet(styles)
export default class Button extends Component {
  render() {
    const {classes, children} = this.props
    return (
      <button className={classes.button}>
        <span className={classes.label}>{children}</span>
      </button>
    )
  }
}
```

## Injection order

Style tags are injected in the exact same order as the `injectSheet()` invocation.
Source order specificity is higher the lower style tag is in the tree, therefore you should call `injectSheet` of components you want to override first.

Example

```js
// Will render labelStyles first.
const Label = injectSheet(labelStyles)(({children}) => <label>{children}</label>)
const Button = injectSheet(buttonStyles)(() => (
  <button>
    <Label>my button</Label>
  </button>
))
```

## Whitelist injected props

By default "classes" and "theme" are going to be injected to the child component over props. Property `theme` is only passed when you use a function instead of styles object.
If you want to whitelist some of them, you can now use option `inject`. For e.g. if you want to access the StyleSheet instance, you need to pass `{inject: ['sheet']}` and it will be available as `props.sheet`.

All user props passed to the HOC will still be forwarded as usual.

```js
// Only `classes` prop will be passed by the ReactJSS HOC now. No `sheet` or `theme`.
const Button = injectSheet(styles, {inject: ['classes', 'sheet']})(({classes}) => (
  <button>My button</button>
))
```

## Contributing

See our [contribution guidelines](./contributing.md).

## License

MIT
