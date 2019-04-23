import React from 'react'
import isPropValid from '@emotion/is-prop-valid'
import withStyles from './withStyles'

const reservedProps = {
  classes: true,
  as: true
}

export const styled = type => {
  const isTag = typeof type === 'string'

  const Styled = props => {
    const {classes, as} = props
    const childProps = {}
    for (const prop in props) {
      if (prop in reservedProps || (isTag && !isPropValid(prop))) continue
      childProps[prop] = props[prop]
    }
    childProps.className = props.className ? `${props.className} ${classes.css}` : classes.css
    return React.createElement(as || type, childProps)
  }

  return (style, options) => {
    const Component = withStyles({css: style}, options)(Styled)
    Component.toString = () => {
      // TODO needs to return the generated class name.s
      return ''
    }
    return Component
  }
}
