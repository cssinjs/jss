import injectSheet from 'react-jss'
import React, {Component} from 'react'
import reactJssRenderer from './reactJssRenderer'
import reactInlineRenderer from './reactInlineRenderer'
import * as jssRenderer from './jssRenderer'
import {tick} from './utils'
import Controls from './Controls'

let update

tick(() => {
  if (update) update()
})

class ReactAnimation extends Component {
  constructor(props) {
    super(props)
    update = this.forceUpdate.bind(this)
    this.Renderer = this.getRenderer(props)
  }

  componentWillReceiveProps(nextProps) {
    this.Renderer = this.getRenderer(nextProps)
  }

  getRenderer({renderer, amount}) {
    const createRenderer = renderer === 'inline' ? reactInlineRenderer : reactJssRenderer
    return createRenderer(amount)
  }

  render() {
    return <this.Renderer />
  }
}

class JssAnimation extends Component {
  constructor(props) {
    super(props)
    update = jssRenderer.update
  }

  componentWillReceiveProps({amount}) {
    jssRenderer.render(amount)
  }

  componentWillMount() {
    update = jssRenderer.update
    jssRenderer.render(this.props.amount)
  }

  componentWillUnmount() {
    jssRenderer.destroy()
  }

  render() {
    return null
  }
}

export default class App extends Component {
  static defaultProps = {
    step: 30
  }

  state = {
    amount: 10,
    renderer: 'react-jss'
  }

  onAdd = e => {
    e.preventDefault()
    this.setState({amount: this.state.amount + this.props.step})
  }

  onChangeRenderer = e => {
    this.setState({renderer: e.target.value})
  }

  render() {
    const {amount, renderer} = this.state
    const Animation = renderer === 'jss' ? JssAnimation : ReactAnimation

    return (
      <div>
        <Controls onAdd={this.onAdd} amount={amount} onChangeRenderer={this.onChangeRenderer} />
        <Animation renderer={renderer} amount={amount} />
      </div>
    )
  }
}
