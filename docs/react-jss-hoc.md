# JSS HOC for React

- [Basic](#basic)
- [Accessing the theme inside the styled component](#accessing-the-theme-inside-the-styled-component)
- [Accessing the theme without a styled component](#accessing-the-theme-without-a-styled-component)
- [The inner component](#the-inner-component)
- [The inner ref](#the-inner-ref)
- [Decorators](#decorators)
- [Injection order](#injection-order)
- [Usage with TypeScript](#usage-with-typescript)

## Usage

React-JSS wraps your component with a [higher-order component](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750).
It injects a `classes` prop, which is a simple map of rule names and generated class names.

Try it out in the [playground](https://codesandbox.io/s/j3l06yyqpw).

## Basic

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

## Accessing the theme inside the styled component

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

const styles = (theme) => ({
  button: {
    background: theme.colorPrimary
  },
  label: {
    fontWeight: 'bold'
  }
})

const StyledButton = withStyles(styles, {injectTheme: true})(Button)
```

## Accessing the theme without a styled component

In case you need to access the theme but not render any CSS, you can also use `withTheme`. It is a Higher-order Component factory which takes a `React.Component` and maps the theme object from context to props. [Read more about `withTheme` in `theming`'s documentation.](https://github.com/cssinjs/theming#withthemecomponent)

```javascript
import React from 'react'
import {withTheme} from 'react-jss'

const Button = withTheme(({theme}) => <button>I can access {theme.colorPrimary}</button>)
```

## The inner component

```javascript
import withStyles from 'react-jss'

const InnerComponent = () => null
const StyledComponent = withStyles({})(InnerComponent)
console.log(StyledComponent.InnerComponent) // Prints out the inner component.
```

## The inner ref

To get a `ref` to the inner element, use the `ref` prop.
We will forward the ref to the inner component.

```javascript
import React from 'react'
import withStyles from 'react-jss'

const InnerComponent = () => null
const StyledComponent = withStyles({})(InnerComponent)

const App = (
  <StyledComponent
    ref={(ref) => {
      console.log(ref)
    }}
  />
)
```

## Decorators

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

## Injection order

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

## Usage with TypeScript

React JSS includes first class support for TypeScript. React JSS provides
a `WithStyles` type which adds types for all of the injected props.
To use it, simply extend your existing props interface with
`WithStyles<typeof styles>`, where `styles` is your styles object.

> Note: To use WithStyles you must use react-jss version 10 or higher.

Example

```typescript
import * as React from 'react'
import withStyles, {WithStylesProps} from 'react-jss'

const styles = {
  button: {
    backgroundColor: 'yellow'
  },
  label: {
    fontWeight: 'bold'
  }
}

interface IProps extends WithStylesProps<typeof styles> {
  children: React.ReactNode
}

const Button: React.FunctionComponent<IProps> = ({classes, children}) => (
  <button className={classes.button}>
    <span className={classes.label}>{children}</span>
  </button>
)

export default withStyles(styles)(Button)
```
