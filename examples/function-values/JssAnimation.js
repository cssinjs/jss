import {Component} from 'react'
import * as jssRenderer from './jssRenderer'

export default class JssAnimation extends Component {
  constructor(props) {
    super(props)
    this.props.setUpdate(jssRenderer.update)
  }

  componentWillMount() {
    this.props.setUpdate(jssRenderer.update)
    jssRenderer.render(this.props.amount)
  }

  componentWillReceiveProps({amount}) {
    jssRenderer.render(amount)
  }

  componentWillUnmount() {
    jssRenderer.destroy()
  }

  render() {
    return null
  }
}
