import React, {Component, useRef} from 'react'

import WithStyles from '.'

interface Props {
  testProp: string
}

class TestComponent extends Component<Props> {
  static defaultProps: Props = {
    testProp: 'hello'
  }

  render() {
    return <div>{this.props.testProp}</div>
  }
}

const TestComponentWitStyles = WithStyles({})(TestComponent)

function testRender() {
  const ref = useRef<any>()

  function refFunction(instance: any) {
    // do smth with instance
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
