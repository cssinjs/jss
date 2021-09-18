import React from 'react'
import withStyles, {Styles} from '../../src'

// Note: Styles type is thoroughly tested in `jss/tests/types/Styles` and `react-jss/tests/types/createUseStyles`.
// This is simply a test to make sure `withStyles` accepts and rejects the correct arguments.

// Note: Testing default theme vs. custom theme is unnecessary here since the user will
// always have to specify the theme anyway.

interface MyProps {
  property: string
}

interface MyTheme {
  color: 'red'
}

function SimpleComponent(props: MyProps) {
  return <div>{props.property}</div>
}

// Intended to test the output of withStyles to make sure the props are still valid
let ResultingComponent: React.ComponentType<MyProps>
let ComponentTest: React.FC

/* -------------------- Function Argument Passing Cases -------------------- */
// Plain Object (no type supplied)
function functionPlainObject(theme: MyTheme) {
  return {
    someClassName: '',
    anotherClassName: {
      fontWeight: 'bold'
    }
  }
}
ResultingComponent = withStyles(functionPlainObject)(SimpleComponent)
ComponentTest = () => <ResultingComponent property="" />

// Plain Styles
function functionPlainStyles(theme: MyTheme): Styles {
  return {
    someClassName: '',
    anotherClassName: {
      fontWeight: 'bold'
    }
  }
}
ResultingComponent = withStyles(functionPlainStyles)(SimpleComponent)
ComponentTest = () => <ResultingComponent property="" />

// With Props
function functionProps(theme: MyTheme): Styles<string, MyProps> {
  return {
    someClassName: ({property}) => '',
    anotherClassName: {
      fontWeight: 'bold'
    }
  }
}
ResultingComponent = withStyles(functionProps)(SimpleComponent)
ComponentTest = () => <ResultingComponent property="" />

// With Props and ClassName rules
function functionPropsAndName(theme: MyTheme): Styles<number, MyProps, undefined> {
  return {
    [1]: ({property}) => '',
    [2]: {
      fontWeight: 'bold'
    }
  }
}
ResultingComponent = withStyles(functionPropsAndName)(SimpleComponent)
ComponentTest = () => <ResultingComponent property="" />

/* -------------------- Regular Object Passing Cases -------------------- */

// Plain Object (no type supplied)
const plainObject = {
  someClassName: '',
  anotherClassName: {
    fontWeight: 'bold'
  }
}
ResultingComponent = withStyles(plainObject)(SimpleComponent)
ComponentTest = () => <ResultingComponent property="" />

// Plain Styles
const stylesPlain: Styles = {
  someClassName: '',
  anotherClassName: {
    fontWeight: 'bold'
  }
}
ResultingComponent = withStyles(stylesPlain)(SimpleComponent)
ComponentTest = () => <ResultingComponent property="" />

// With Props
const stylesProps: Styles<string, MyProps> = {
  someClassName: ({property}) => '',
  anotherClassName: {
    fontWeight: 'bold'
  }
}
ResultingComponent = withStyles(stylesProps)(SimpleComponent)
ComponentTest = () => <ResultingComponent property="" />

// With Theme
const stylesTheme: Styles<string, unknown, MyTheme> = {
  someClassName: ({theme}) => '',
  anotherClassName: {
    fontWeight: 'bold'
  }
}
ResultingComponent = withStyles(stylesTheme)(SimpleComponent)
ComponentTest = () => <ResultingComponent property="" />

// With Props and Theme
const stylesPropsAndTheme: Styles<string, MyProps, MyTheme> = {
  someClassName: ({property, theme}) => '',
  anotherClassName: {
    fontWeight: 'bold'
  }
}
ResultingComponent = withStyles(stylesPropsAndTheme)(SimpleComponent)
ComponentTest = () => <ResultingComponent property="" />

// With Props and Theme and ClassName rules
const stylesPropsAndThemeAndName: Styles<number, MyProps, MyTheme> = {
  [1]: ({property, theme}) => '',
  [2]: {
    fontWeight: 'bold'
  }
}
ResultingComponent = withStyles(stylesPropsAndThemeAndName)(SimpleComponent)
ComponentTest = () => <ResultingComponent property="" />

/* -------------------- Failing Cases -------------------- */

function failingFunctionWrongTheme(theme: MyTheme): Styles<string, unknown, MyTheme> {
  return {
    someClassName: '',
    anotherClassName: {
      fontWeight: 'bold'
    }
  }
}

function failingFunctionNullTheme(theme: MyTheme): Styles<string, unknown, null> {
  return {
    someClassName: '',
    anotherClassName: {
      fontWeight: 'bold'
    }
  }
}

// @ts-expect-error - can't override `theme` argument
withStyles(failingFunctionWrongTheme)(SimpleComponent)
// @ts-expect-error - can't use null as a theme
withStyles(failingFunctionNullTheme)(SimpleComponent)
