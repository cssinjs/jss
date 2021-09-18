# Introduction

JSS is an authoring tool for CSS which allows you to use JavaScript to describe styles in a declarative, conflict-free and reusable way. It can compile in the browser, server-side or at build time in Node.

JSS is framework agnostic. It consists of multiple packages: the core, plugins, framework integrations and others.

## Online Playgrounds

If you’re interested in playing around with JSS, you can use an online code playground. Try a Hello World example on CodeSandbox.

- [JSS](https://codesandbox.io/s/z21lpmvv33)
- [React-JSS](https://codesandbox.io/s/j3l06yyqpw)

## Online Compiler

https://cssinjs.org/repl

## Third-party API adapters

- [Styled-JSS](https://github.com/cssinjs/styled-jss/) - styled-components like API.
- [Glamor-JSS](https://github.com/dan-lee/glamor-jss/) - glamor flavored CSS with JSS under the hood.
- [Aphrodite-JSS](https://github.com/cssinjs/aphrodite-jss/) - aphrodite like API.

## JSS Example

```javascript
import jss from 'jss'
import preset from 'jss-preset-default'
import color from 'color'

// One time setup with default plugins and settings.
jss.setup(preset())

const styles = {
  '@global': {
    body: {
      color: 'green'
    },
    a: {
      textDecoration: 'underline'
    }
  },
  withTemplates: `
    border-radius: 3px;
    background-color: green;
    color: red;
    margin: 20px 40px;
    padding: 10px;
  `,
  button: {
    fontSize: 12,
    '&:hover': {
      background: 'blue'
    }
  },
  ctaButton: {
    extend: 'button',
    '&:hover': {
      background: color('blue').darken(0.3).hex()
    }
  },
  '@media (min-width: 1024px)': {
    button: {
      width: 200
    }
  }
}

const {classes} = jss.createStyleSheet(styles).attach()

document.body.innerHTML = `
  <button class="${classes.button}">Button</button>
  <button class="${classes.ctaButton}">CTA Button</button>
`
```

## React-JSS Example

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
})

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
