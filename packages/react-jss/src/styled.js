/* eslint-disable react/prop-types */
// TODO add flow
import React from 'react'
import isPropValid from '@emotion/is-prop-valid'
import withStyles from './withStyles'

// Props we don't want to forward.
const reservedProps = {
  classes: true,
  as: true,
  theme: true
}

export default type => {
  const isTag = typeof type === 'string'

  return (style, options) => {
    const Styled = props => {
      const {classes, as} = props
      const childProps = {}
      for (const prop in props) {
        if (prop in reservedProps) continue
        // We don't want to pass non-dom props to the DOM,
        // but we still wat to forward them to a uses component.
        if (isTag && !isPropValid(prop)) continue
        childProps[prop] = props[prop]
      }
      childProps.className = props.className ? `${props.className} ${classes.css}` : classes.css
      return React.createElement(as || type, childProps)
    }

    return withStyles({css: style}, {...options, injectTheme: true})(Styled)
  }
}
