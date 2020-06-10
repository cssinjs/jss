import React, {Component} from 'react'

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
  // component shouldn't ask to pass `testProp`
  return <TestComponentWitStyles />
}
