// @flow
/* eslint-disable prefer-rest-params, prefer-spread */
import React from 'react'
import defaultCss, {type Css} from 'css-jss'

export const create = (css: Css = defaultCss) =>
  // $FlowIgnore we don't care about the types here, since this is going to be called by the build tool.
  function createElement(type, props) {
    const args = arguments
    if (props && props.css) {
      const className = css(props.css)
      const newProps = Object.assign({}, props)
      newProps.className = props.className ? `${props.className} ${className}` : className
      delete newProps.css
      args[1] = newProps
    }
    // $FlowIgnore
    return React.createElement.apply(undefined, args)
  }

export default create()
