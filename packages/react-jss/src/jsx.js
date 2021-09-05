/* eslint-disable prefer-rest-params, prefer-spread */
import * as React from 'react'
import defaultCss from 'css-jss'

export const create = (css = defaultCss) =>
  function createElement(type, props) {
    const args = arguments
    if (props && props.css) {
      const className = css(props.css)
      const newProps = Object.assign({}, props)
      newProps.className = props.className ? `${props.className} ${className}` : className
      delete newProps.css
      args[1] = newProps
    }
    return React.createElement.apply(undefined, args)
  }

export default create()
