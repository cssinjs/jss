import React, {Component, useRef} from 'react'

import WithStyles from '.'

interface Props {
  testProp: string
}

class TestComponent extends Component<Props> {
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
  const ref = useRef<TestComponent>()

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
