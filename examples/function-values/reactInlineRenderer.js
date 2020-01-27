import React from 'react'
import times from 'lodash/times'
import {getRandomColor, getRandomTransform} from './utils'

export default amount => () => (
  <div>
    {times(amount, i => {
      const style = {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: '50%',
        transition: 'transform 500ms',
        background: getRandomColor(),
        transform: getRandomTransform()
      }
      return <div key={i} style={style} />
    })}
  </div>
)
