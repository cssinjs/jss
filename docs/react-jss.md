## JSS integration with React

React-JSS provides components for [JSS](https://github.com/cssinjs/jss) as a layer of abstraction. JSS and the [default preset](https://github.com/cssinjs/jss-preset-default) are already built in! Try it out in the [playground](https://codesandbox.io/s/j3l06yyqpw).

Benefits compared to the lower level core:

- Dynamic Theming - allows context based theme propagation and runtime updates.
- Critical CSS extraction - only CSS from rendered components gets extracted.
- Lazy evaluation - Style Sheets are created when a component mounts and removed when it's unmounted.
- The static part of a Style Sheet will be shared between all elements.
- Function values and rules are updated automatically with props as an argument.

### Table of Contents

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

### Install

```
yarn add react-jss
```

### Usage

React-JSS wraps your component with a [higher-order component](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750).
It injects a `classes` prop, which is a simple map of rule names and generated class names.

Try it out in the [playground](https://codesandbox.io/s/j3l06yyqpw).

#### Basic

```javascript
import React from 'react'
import {render} from 'react-dom'
import withStyles from 'react-jss'

// Create your Styles. Remember, since React-JSS uses the default preset,
// most plugins are available without further configuration needed.
const styles = {
  myButton: {
    color: 'green',
    margin: {
      // jss-plugin-expand gives more readable syntax
      top: 5, // jss-plugin-default-unit makes this 5px
      right: 0,
      bottom: 0,
      left: '1rem'
    },
    '& span': {
      // jss-plugin-nested applies this to a child span
      fontWeight: 'bold' // jss-plugin-camel-case turns this into 'font-weight'
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
const StyledButton = withStyles(styles)(Button)
// You can also export the component with
// export default withStyles(styles)(Button)

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

#### Dynamic values

You can use [function values](jss-syntax.md#function-values), Function rules and observables out of the box. Function values and function rules will receive a props object once the component receives new props or mounts for the first time.

Caveats:

Static properties being rendered first so that function values will have higher source order specificity.

```javascript
import React from 'react'
import withStyles from 'react-jss'

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

const StyledButton = withStyles(styles)(Button)

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

#### Theming

The idea is that you define a theme, wrap your application with `ThemeProvider` and pass the `theme` to `ThemeProvider`. ThemeProvider will pass it over `context` to your styles creator function and your props. After that, you may change your theme, and all your components will get the new theme automatically.

Under the hood `react-jss` uses the unified CSSinJS `theming` solution for React. You can find [full docs in its repo](https://github.com/iamstarkov/theming).

Usage of `ThemeProvider`:

- It has a `theme` prop which should be an `object` or `function`:
  - If it is an `Object` and used in a root `ThemeProvider`, then it's intact and being passed down the React Tree.
  - If it is `Object` and used in a nested `ThemeProvider`, then it gets merged with the theme from a parent `ThemeProvider` and passed down the react tree.
  - If it is `Function` and used in a nested `ThemeProvider`, then it's being applied to the theme from a parent `ThemeProvider`. If the result is an `Object` it will be passed down the react tree, throws otherwise.
- `ThemeProvider` as every other component can render only a single child because it uses `React.Children.only` in render and throws otherwise.
- [Read more about `ThemeProvider` in `theming`'s documentation.](https://github.com/cssinjs/theming#themeprovider)

```javascript
import React from 'react'
import withStyles, {ThemeProvider} from 'react-jss'

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

const StyledButton = withStyles(styles)(Button)

const theme = {
  colorPrimary: 'green'
}

const App = () => (
  <ThemeProvider theme={theme}>
    <StyledButton>I am a button with green background</StyledButton>
  </ThemeProvider>
)
```

#### Accessing the theme inside the styled component

The theme will not be injecting into the wrapped component.
To inject the theme into the wrapped component, pass the `injectTheme` option to `withStyles`.

```javascript
import React from 'react'
import withStyles from 'react-jss'

const DeleteIcon = () => null

const Button = ({classes, children, theme}) => (
  <button className={classes.button}>
    <span className={classes.label}>{children}</span>

    {theme.useIconButtons && <DeleteIcon />}
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

const StyledButton = withStyles(styles, {injectTheme: true})(Button)
```

#### Accessing the theme without a styled component

In case you need to access the theme but not render any CSS, you can also use `withTheme`. It is a Higher-order Component factory which takes a `React.Component` and maps the theme object from context to props. [Read more about `withTheme` in `theming`'s documentation.](https://github.com/cssinjs/theming#withthemecomponent)

```javascript
import React from 'react'
import {withTheme} from 'react-jss'

const Button = withTheme(({theme}) => <button>I can access {theme.colorPrimary}</button>)
```

#### Using custom Theming Context

Use _namespaced_ themes so that a set of UI components gets no conflicts with another set of UI components from a different library also using `react-jss`.

```javascript
import React from 'react'
import withStyles, {createTheming} from 'react-jss'

const ThemeContext = React.createContext({})

// Creating a namespaced theming object.
const theming = createTheming(ThemeContext)

const {ThemeProvider} = theming

const styles = theme => ({
  button: {
    background: theme.colorPrimary
  }
})

const theme = {
  colorPrimary: 'green'
}

const Button = ({classes, children}) => <button className={classes.button}>{children}</button>

// Passing namespaced theming object inside withStyles options.
const StyledButton = withStyles(styles, {theming})(Button)
const OtherLibraryThemeProvider = () => null
const OtherLibraryComponent = () => null
const otherLibraryTheme = {}

// Using namespaced ThemeProviders - they can be nested in any order
const App = () => (
  <OtherLibraryThemeProvider theme={otherLibraryTheme}>
    <OtherLibraryComponent />
    <ThemeProvider theme={theme}>
      <StyledButton>Green Button</StyledButton>
    </ThemeProvider>
  </OtherLibraryThemeProvider>
)
```

#### Server-side rendering

After the application is mounted, you should remove the style tag used by critical CSS rendered server-side.

```javascript
import React from 'react'
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

  // Any instances of `withStyles` within `<MyApp />` will have gotten sheets
  // from `context` and added their Style Sheets to it by now.

  return res.send(
    renderToString(
      <html lang="en">
        <head>
          <style type="text/css">{sheets.toString()}</style>
        </head>
        <body>{body}</body>
      </html>
    )
  )
}
```

#### React tree traversing

For traversing the React tree outside of the HTML rendering, you should add `disableStylesGeneration` property.

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
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

#### Reuse styles in different components

To reuse the same styles **and** the same generated style sheet between 2 entirely different and unrelated components, we suggest extracting a renderer component and reusing that.

```javascript
import React from 'react'
import withStyles from 'react-jss'

const styles = {
  button: {
    color: 'red'
  }
}
const RedButton = withStyles(styles)(({classes, children}) => (
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

Alternatively, you can create own Style Sheet and use the `composes` feature. Also, you can mix in a common styles object but take into account that it can increase the overall CSS size.

#### The inner component

```javascript
import withStyles from 'react-jss'

const InnerComponent = () => null
const StyledComponent = withStyles({})(InnerComponent)
console.log(StyledComponent.InnerComponent) // Prints out the inner component.
```

#### The inner ref

To get a `ref` to the inner element, use the `ref` prop.
We will forward the ref to the inner component.

```javascript
import React from 'react'
import withStyles from 'react-jss'

const InnerComponent = () => null
const StyledComponent = withStyles({})(InnerComponent)

const App = (
  <StyledComponent
    ref={ref => {
      console.log(ref)
    }}
  />
)
```

#### Custom setup

If you want to specify a JSS version and plugins to use, you should create your [own JSS instance](https://github.com/cssinjs/jss/blob/master/docs/jss-api.md#create-an-own-jss-instance), [setup plugins](https://github.com/cssinjs/jss/blob/master/docs/setup.md#setup-with-custom-plugins) and pass it to `JssProvider`.

```javascript
import React from 'react'
import {create as createJss} from 'jss'
import {JssProvider} from 'react-jss'
import vendorPrefixer from 'jss-plugin-vendor-prefixer'

const jss = createJss()
jss.use(vendorPrefixer())

const App = () => null
const Component = () => (
  <JssProvider jss={jss}>
    <App />
  </JssProvider>
)
```

You can also access the default JSS instance.

```javascript
import {jss} from 'react-jss'
```

#### Multi-tree setup

In case you render multiple react rendering trees in one application, you will get class name collisions because every JssProvider rerender will reset the class names generator. If you want to avoid this, you can share the class names generator between multiple JssProvider instances.

**Note**: in case of SSR, make sure to create a new generator for **each** request. Otherwise, class names will become indeterministic, and at some point, you may run out of max safe integer numbers.

```javascript
import React from 'react'
import {createGenerateId, JssProvider} from 'react-jss'

const generateId = createGenerateId()
const App1 = () => null
const App2 = () => null

const Component = () => (
  <div>
    <JssProvider generateId={generateId}>
      <App1 />
    </JssProvider>
    <JssProvider generateId={generateId}>
      <App2 />
    </JssProvider>
  </div>
)
```

You can also additionally use the `classNamePrefix` prop to add the app/subtree name to each class name.
This way you can see which app generated a class name in the DOM view.

```javascript
import React from 'react'
import {JssProvider} from 'react-jss'

const App1 = () => null
const App2 = () => null

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

#### Decorators

_Beware that [decorators are stage-2 proposal](https://tc39.github.io/proposal-decorators/), so there are [no guarantees that decorators will make its way into language specification](https://tc39.github.io/process-document/). Do not use it in production. Use it at your own risk and only if you know what you are doing._

You will need [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy).

```javascript
import React, {Component} from 'react'
import withStyles from 'react-jss'

const styles = {
  button: {
    backgroundColor: 'yellow'
  },
  label: {
    fontWeight: 'bold'
  }
}

@withStyles(styles)
class Button extends Component {
  render() {
    const {classes, children} = this.props
    return (
      <button className={classes.button}>
        <span className={classes.label}>{children}</span>
      </button>
    )
  }
}

export default Button
```

### Injection order

Injection of style tags happens in the same order as the `withStyles()` invocation.
Source order specificity is higher the lower style tag is in the tree. Therefore you should call `withStyles` of components you want to override first.

Example

```javascript
import React from 'react'
import withStyles from 'react-jss'

const labelStyles = {}
const buttonStyles = {}

// Will render labelStyles first.
const Label = withStyles(labelStyles)(({children}) => <label>{children}</label>)
const Button = withStyles(buttonStyles)(() => (
  <button>
    <Label>my button</Label>
  </button>
))
```
