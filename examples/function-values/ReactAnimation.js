import React, {Component} from 'react'
import reactJssRenderer from './reactJssRenderer'
import reactInlineRenderer from './reactInlineRenderer'

function getRenderer({renderer, amount}) {
  const createRenderer = renderer === 'inline' ? reactInlineRenderer : reactJssRenderer
  return createRenderer(amount)
}

export default class ReactAnimation extends Component {
  constructor(props) {
    super(props)
    this.props.setUpdate(this.forceUpdate.bind(this))
    this.Renderer = getRenderer(props)
  }

  componentWillReceiveProps(nextProps) {
    this.Renderer = getRenderer(nextProps)
  }

  render() {
    return <this.Renderer />
  }
}
