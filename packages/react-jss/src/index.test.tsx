import * as React from 'react'
import WithStyles, {createUseStyles} from '.'

const expectType = <T extends any>(x: T): T => x

interface Props {
  testProp: string
}

class TestComponent extends React.Component<Props> {
  static defaultProps: Props = {
    testProp: 'hello'
  }

  state = {message: ''}

  render() {
    return (
      <div>
        <span>{this.props.testProp}</span>
        <span>{this.state.message}</span>
      </div>
    )
  }
}
const cc = new TestComponent({testProp: ''})
cc.render()
const TestComponentWitStyles = WithStyles({})(TestComponent)

function testRender() {
  const ref = React.useRef<TestComponent>()

  function refFunction(instance: TestComponent) {
    instance.setState({message: 'From ref'})
  }

  // component shouldn't ask to pass `testProp`
  // component can accept innerRef prop
  return (
    <>
      <TestComponentWitStyles />
      <TestComponentWitStyles innerRef={ref} />
      <TestComponentWitStyles innerRef={refFunction} />
    </>
  )
}

declare global {
  namespace Jss {
    export interface Theme {
      themeColour: string
      defaultFontSize: number
    }
  }
}

const useStyles = createUseStyles(theme => {
  expectType<string>(theme.themeColour)
  expectType<number>(theme.defaultFontSize)

  return {
    myDiv: {
      color: theme.themeColour,
      // @ts-expect-error typescript should error here since the theme property doesn't exist
      border: theme.aPropertyThatDoesntExist
    }
  }
})

export function Component() {
  const classes = useStyles()

  expectType<string>(classes.myDiv)

  return (
    <>
      <div className={classes.myDiv} />
      {/* @ts-expect-error typescript should error here since the class is invalid */}
      <div className={classes.thisClassDoesntExist} />
    </>
  )
}
