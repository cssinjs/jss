# JSS integration with React

React-JSS integrates [JSS](https://github.com/cssinjs/jss) with React using the new Hooks API. JSS and the [default preset](https://github.com/cssinjs/jss/tree/master/packages/jss-preset-default) are already built in.

Try it out in the [playground](https://codesandbox.io/s/j3l06yyqpw).

**The HOC based API is deprecated as of v10 and may be removed in a future version. You can still perform a lazy migration as described [here](https://reacttraining.com/blog/using-hooks-in-classes/). HOC specific docs are available [here](./react-jss-hoc.md).**

### Benefits compared to using the core JSS package directly:

- Dynamic Theming - allows context based theme propagation and runtime updates.
- Critical CSS extraction - only CSS from rendered components gets extracted.
- Lazy evaluation - Style Sheets are created when a component mounts and removed when it's unmounted.
- The static part of a Style Sheet will be shared between all elements.
- Function values and rules are updated automatically with any data you pass to `useStyles(data)`. You can pass props, state or anything from context for example.

## Table of Contents

- [Install](#install)
- [Basic](#basic)
- [Dynamic Values](#dynamic-values)
- [Prefix classname](#prefix-classname)
- [Theming](#theming)
- [Accessing the theme inside the styled component](#accessing-the-theme-inside-the-styled-component)
- [Accessing the theme without styles](#accessing-the-theme-without-styles)
- [Using custom Theming Context](#using-custom-theming-context)
- [Class name generator options](#class-name-generator-options)
- [Server-side rendering](#server-side-rendering)
- [React tree traversing](#react-tree-traversing)
- [Custom setup](#custom-setup)
- [Multi-tree setup](#multi-tree-setup)
- [Injection order](#injection-order)
- [Usage with TypeScript](#usage-with-typescript)

## Install

```
yarn add react-jss
```

## Basic

```javascript
import React from 'react'
import {render} from 'react-dom'
import {createUseStyles} from 'react-jss'

// Create your Styles. Remember, since React-JSS uses the default preset,
// most plugins are available without further configuration needed.
const useStyles = createUseStyles({
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
})

// Define the component using these styles and pass it the 'classes' prop.
// Use this to assign scoped class names.
const Button = ({children}) => {
  const classes = useStyles()
  return (
    <button className={classes.myButton}>
      <span className={classes.myLabel}>{children}</span>
    </button>
  )
}

const App = () => <Button>Submit</Button>

render(<App />, document.getElementById('root'))
```

The above code will compile to

```html
<div id="root">
  <button class="Button-myButton-1-25">
    <span class="Button-myLabel-1-26"> Submit </span>
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

## Dynamic values

You can use [function values](jss-syntax.md#function-values), Function rules and observables out of the box. Function values and function rules will receive a props object once the component receives new props or mounts for the first time.

Caveats:

Static properties being rendered first so that function values will have higher source order specificity.

```javascript
import React from 'react'
import {createUseStyles} from 'react-jss'

const useStyles = createUseStyles({
  myButton: {
    padding: (props) => props.spacing
  },
  myLabel: (props) => ({
    display: 'block',
    color: props.labelColor,
    fontWeight: props.fontWeight,
    fontStyle: props.fontStyle
  })
})

const Button = ({children, ...props}) => {
  const classes = useStyles(props)
  return (
    <button className={classes.myButton}>
      <span className={classes.myLabel}>{children}</span>
    </button>
  )
}

Button.defaultProps = {
  spacing: 10,
  fontWeight: 'bold',
  labelColor: 'red'
}

const App = () => <Button fontStyle="italic">Submit</Button>
```

The above code will compile to

```html
<div id="root">
  <button class="myButton-1-25">
    <span class="myLabel-1-26"> Submit </span>
  </button>
</div>
```

and

```css
.myButton-1-25 {
  padding: 10px;
}
.myLabel-1-26 {
  display: block;
  color: red;
  font-weight: bold;
  font-style: italic;
}
```

## Prefix classname

```javascript
import React from 'react'
import {createUseStyles} from 'react-jss'

const useStyles = createUseStyles(
  {
    myButton: {
      padding: (props) => props.spacing
    },
    myLabel: (props) => ({
      display: 'block',
      color: props.labelColor,
      fontWeight: props.fontWeight,
      fontStyle: props.fontStyle
    })
  },
  {name: 'Button'}
)

const Button = ({children, ...props}) => {
  const classes = useStyles(props)
  return (
    <button className={classes.myButton}>
      <span className={classes.myLabel}>{children}</span>
    </button>
  )
}

Button.defaultProps = {
  spacing: 10,
  fontWeight: 'bold',
  labelColor: 'red'
}

const App = () => <Button fontStyle="italic">Submit</Button>
```

The above code will compile to

```html
<div id="root">
  <button class="Button-myButton-1-25">
    <span class="Button-myLabel-1-26"> Submit </span>
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

## Theming

The idea is that you define a theme, wrap your application with `ThemeProvider` and pass the `theme` object to `ThemeProvider`. Later you can access theme in your styles creator function and using a `useTheme()` hook. After that, you may change your theme, and all your components will get the new theme automatically.

Under the hood `react-jss` uses a standalone `theming` solution for React. You can find [full docs in its repo](https://github.com/cssinjs/theming).

Usage of `ThemeProvider`:

- It has a `theme` prop which should be an `object` or `function`:
  - If it is an `Object` and used in a root `ThemeProvider`, then it's intact and being passed down the React Tree.
  - If it is `Object` and used in a nested `ThemeProvider`, then it gets merged with the theme from a parent `ThemeProvider` and passed down the react tree.
  - If it is `Function` and used in a nested `ThemeProvider`, then it's being applied to the theme from a parent `ThemeProvider`. If the result is an `Object` it will be passed down the react tree, throws otherwise.
- `ThemeProvider` as every other component can render only a single child because it uses `React.Children.only` in render and throws otherwise.
- [Read more about `ThemeProvider` in `theming`'s documentation.](https://github.com/cssinjs/theming#themeprovider)

```javascript
import React from 'react'
import {createUseStyles, useTheme, ThemeProvider} from 'react-jss'

// Using `theme` function is better when you have many theme dependant styles.
// Note that in this case you don't need to use useTheme(), it subscribes to the them automatically
const useStylesFromThemeFunction = createUseStyles((theme) => ({
  button: {
    background: theme.colorPrimary
  },
  label: {
    fontWeight: 'bold'
  }
}))

const Button1 = ({children, ...props}) => {
  const classes = useStylesFromThemeFunction(props)
  return (
    <button className={classes.button}>
      <span className={classes.label}>{children}</span>
    </button>
  )
}

// Using function values might be better if you have only few theme dependant styles
// and also props or state is used for other values.
const useStyles = createUseStyles({
  button: {
    background: ({theme}) => theme.colorPrimary
  },
  label: {
    fontWeight: 'bold'
  }
})

const Button2 = ({children, ...props}) => {
  const theme = useTheme()
  const classes = useStyles({...props, theme})
  return (
    <button className={classes.button}>
      <span className={classes.label}>{children}</span>
    </button>
  )
}

const theme = {
  colorPrimary: 'green'
}

const App = () => (
  <ThemeProvider theme={theme}>
    <Button1>I am a button 1 with green background</Button1>
    <Button2>I am a button 2 with green background</Button2>
  </ThemeProvider>
)
```

## Using custom Theming Context

Use _namespaced_ themes so that a set of UI components gets no conflicts with another set of UI components from a different library also using `react-jss` or in case you want to use the same theme from another context that is already used in your app.

```javascript
import React from 'react'
import {createUseStyles, createTheming} from 'react-jss'

const ThemeContext = React.createContext({})

// Creating a namespaced theming object.
const theming = createTheming(ThemeContext)

// Note that `useTheme` here comes from the `theming` object, NOT from `react-jss` import.
const {ThemeProvider, useTheme} = theming

const useStyles = createUseStyles(
  {
    button: {
      background: ({theme}) => theme.colorPrimary
    }
    // Passing theming object to `createUseStyles()`
  },
  {theming}
)

const myTheme = {
  colorPrimary: 'green'
}

const Button = ({children, ...props}) => {
  const theme = useTheme()
  const classes = useStyles({...props, theme})
  return <button className={classes.button}>{children}</button>
}

const OtherLibraryThemeProvider = () => null
const OtherLibraryComponent = () => null
const otherLibraryTheme = {}

// Using namespaced ThemeProviders - they can be nested in any order
const App = () => (
  <OtherLibraryThemeProvider theme={otherLibraryTheme}>
    <OtherLibraryComponent />
    <ThemeProvider theme={myTheme}>
      <Button>Green Button</Button>
    </ThemeProvider>
  </OtherLibraryThemeProvider>
)
```

## Class name generator options

Make sure using the same setup on the server and on the client. Id generator is used for class names and for keyframes.

1. You can change the class name generation algorithm by passing your custom [generator function](./jss-api.md#generate-your-class-names) prop.

   ```javascript
   import React from 'react'
   import ReactDOM from 'react-dom'
   import {JssProvider} from 'react-jss'
   import MyApp from './MyApp'

   const generateId = (rule, sheet) => 'some-id'
   ReactDOM.render(
     <JssProvider generateId={generateId}>
       <MyApp />
     </JssProvider>,
     document.getElementById('root')
   )
   ```

1. You can add an additional prefix to each class, [see here](#multi-tree-setup).

1. You can minify class names by passing `id` prop, so that prefixes a not used, [see also](./jss-api.md#minify-selectors).

   ```javascript
   import React from 'react'
   import ReactDOM from 'react-dom'
   import {JssProvider} from 'react-jss'
   import MyApp from './MyApp'

   ReactDOM.render(
     <JssProvider id={{minify: true}}>
       <MyApp />
     </JssProvider>,
     document.getElementById('root')
   )
   ```

## Server-side rendering

After the application is mounted, you should remove the style tag used by critical CSS rendered server-side.

```javascript
import React from 'react'
import {renderToString} from 'react-dom/server'
import {JssProvider, SheetsRegistry, createGenerateId} from 'react-jss'
import MyApp from './MyApp'

export default function render(req, res) {
  const sheets = new SheetsRegistry()
  const generateId = createGenerateId()

  const body = renderToString(
    <JssProvider registry={sheets} generateId={generateId}>
      <MyApp />
    </JssProvider>
  )

  // Any instances using `useStyles` within `<MyApp />` will have gotten sheets
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

## React tree traversing

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

## Custom setup

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

## Multi-tree setup

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

## Injection order

Injection of style tags happens in the same order as the `createUseStyles()` invocation.
Source order specificity is higher the lower style tag is in the tree. Therefore you should call `createUseStyles` of components you want to override first.

Example

```javascript
import React from 'react'
import {createUseStyles} from 'react-jss'

// Will render first once component mounts, because `createUseStyles()` call order matters.
const useLabelStyles = createUseStyles({
  label: {
    color: 'red'
  }
})

const useButtonStyles = createUseStyles({
  button: {
    color: 'red'
  }
})

// Will render styles first.
const Label = ({children}) => {
  const classes = useLabelStyles()
  return <label className={classes.label}>{children}</label>
}

const Button = () => {
  const classes = useButtonStyles()
  // The order in which we render those components doesn't matter.
  // What matters is the order of `createUseStyles()` calls.
  return (
    <>
      <button className={classes.button} />
      <Label>my button</Label>
    </>
  )
}
```

## Usage with TypeScript

For help using TypeScript with React-JSS, go [here](react-jss-ts.md).
