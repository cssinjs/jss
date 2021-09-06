import React from 'react'
import {createUseStyles, useTheme, Styles} from 'react-jss'

/* -------------------- Defined HOC for Docs -------------------- */
type ReactJSSProps = {classes?: ReturnType<ReturnType<typeof createUseStyles>>}

/**
 * Creates a Higher Order Component that injects the CSS specified in `styles`.
 * @param styles
 */
function withStyles<C extends string, Pr extends ReactJSSProps, T>(
  styles: Styles<C, Pr, T> | ((theme: T) => Styles<C, Pr>)
) {
  return function<P extends Pr, S>(WrappedComponent: React.ComponentClass<P, S>): React.FC<P> {
    const useStyles = createUseStyles<C, P, T>(styles)

    const StyledComponent: React.FC<P> = (props: P) => {
      const {classes, ...passThroughProps} = props
      const theme = useTheme<T>()
      const reactJssClasses = useStyles({...(passThroughProps as P), theme})

      return <WrappedComponent {...passThroughProps as P} classes={reactJssClasses} />
    }

    StyledComponent.displayName = `withStyles(${WrappedComponent.name})`

    return StyledComponent
  }
}

export default withStyles

/* ------------------------------ Tests for HOC (should mimic withStyles.tsx tests) ------------------------------ */

// Note: Styles type is thoroughly tested in `jss/tests/types/Styles` and `react-jss/tests/types/createUseStyles`.
// This is simply a test to make sure `withStyles` accepts and rejects the correct arguments.

// Note: Testing default theme vs. custom theme is unnecessary here since the user will
// always have to specify the theme anyway.

interface MyProps {
  classes?: Record<string, string>
  property: string
}

interface MyTheme {
  color: 'red'
}

class SimpleComponent extends React.Component<MyProps> {
  render() {
    return <div>{this.props.property}</div>
  }
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

// A function argument cannot provide another defined theme type conflicting with `undefined`
function passingFunctionAnyTheme(theme: MyTheme): Styles<string, unknown, any> {
  return {
    someClassName: '',
    anotherClassName: {
      fontWeight: 'bold'
    }
  }
}

function passingFunctionUnknownTheme(theme: MyTheme): Styles<string, unknown, unknown> {
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

// @ts-expect-error
withStyles(failingFunctionNullTheme)(SimpleComponent)
withStyles(passingFunctionAnyTheme)(SimpleComponent)
withStyles(passingFunctionUnknownTheme)(SimpleComponent)

// A functional component cannot be passed to the HOC
const SimpleFunctionComponent: React.FC = () => <div>This should fail</div>

// @ts-expect-error
withStyles({})(SimpleFunctionComponent)

// Conflicting props are not allowed
interface ConflictingProps {
  classes?: Record<string, string>
  invalidProp: number
}

const conflictingStyles: Styles<string, ConflictingProps> = {
  someClassName: props => ({fontSize: props.invalidProp})
}

// @ts-expect-error
withStyles(conflictingStyles)(SimpleComponent)
