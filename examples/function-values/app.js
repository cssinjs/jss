import React, {Component} from 'react'
import Controls from './Controls'
import JssAnimation from './JssAnimation'
import ReactAnimation from './ReactAnimation'
import {tick} from './utils'

let update

tick(() => {
  if (update) update()
})

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
    this.setState(state => ({amount: state.amount + this.props.step}))
  }

  onChangeRenderer = e => {
    this.setState({renderer: e.target.value})
  }

  setUpdate = fn => {
    update = fn
  }

  render() {
    const {amount, renderer} = this.state
    const Animation = renderer === 'jss' ? JssAnimation : ReactAnimation

    return (
      <div>
        <Controls onAdd={this.onAdd} amount={amount} onChangeRenderer={this.onChangeRenderer} />
        <Animation setUpdate={this.setUpdate} renderer={renderer} amount={amount} />
      </div>
    )
  }
}
