import React, {Component} from 'react'
import injectSheet from 'react-jss'
import times from 'lodash/times'
import {getRandomColor, getRandomTransform} from './utils'

export default amount => {
  class JssAnimatedObjects extends Component {
    shouldComponentUpdate = () => false

    render() {
      const {classes} = this.props
      return (
        <div>
          {times(amount, i => (
            <div key={i} className={classes[`object${i}`]} />
          ))}
        </div>
      )
    }
  }

  const styles = {}

  times(amount, i => {
    styles[`object${i}`] = {
      position: 'absolute',
      width: 50,
      height: 50,
      borderRadius: '50%',
      transition: 'transform 500ms',
      background: getRandomColor(),
      transform: getRandomTransform
    }
  })

  return injectSheet(styles)(JssAnimatedObjects)
}
