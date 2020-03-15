import React from 'react'
import {render} from 'react-dom'
import Button from './src/Button'

render(<Button />, document.getElementById('app'), () => {
  // We don't need the static css any more once we have launched our application.
  const ssStyles = document.getElementById('server-side-styles')
  ssStyles.parentNode.removeChild(ssStyles)
})
