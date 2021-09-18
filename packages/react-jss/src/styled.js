/* eslint-disable react/prop-types, react/require-default-props */

import * as React from 'react'
import isPropValid from '@emotion/is-prop-valid'
import {ThemeContext as DefaultThemeContext} from 'theming'

import createUseStyles from './createUseStyles'

// eslint-disable-next-line no-unused-vars
const parseStyles = (args) => {
  const dynamicStyles = []
  let staticStyle
  const labels = []

  // Not using ...rest to optimize perf.
  for (const key in args) {
    const style = args[key]
    if (!style) continue
    if (typeof style === 'function') {
      dynamicStyles.push(style)
    } else {
      if (!staticStyle) staticStyle = {}
      Object.assign(staticStyle, style)
      const {label} = staticStyle
      if (label) {
        if (labels.indexOf(label) === -1) labels.push(label)
      }
    }
  }

  const styles = {}
  const label = labels.length === 0 ? 'sc' : labels.join('-')

  if (staticStyle) {
    // Label should not leak to the core.
    if ('label' in staticStyle) delete staticStyle.label
    styles[label] = staticStyle
  }

  // When there is only one function rule, we don't need to wrap it.
  if (dynamicStyles.length === 1) {
    styles.scd = dynamicStyles[0]
  }

  // We create a new function rule which will call all other function rules
  // and merge the styles they return.
  if (dynamicStyles.length > 1) {
    styles.scd = (props) => {
      const merged = {}
      for (let i = 0; i < dynamicStyles.length; i++) {
        const dynamicStyle = dynamicStyles[i](props)
        if (dynamicStyle) Object.assign(merged, dynamicStyle)
      }
      return merged
    }
  }

  return {styles, label}
}

const shouldForwardPropSymbol = Symbol('react-jss-styled')

const getShouldForwardProp = (tagOrComponent, options) => {
  const {shouldForwardProp} = options
  const childShouldForwardProp = tagOrComponent[shouldForwardPropSymbol]
  let finalShouldForwardProp = shouldForwardProp || childShouldForwardProp
  if (shouldForwardProp && childShouldForwardProp) {
    finalShouldForwardProp = (prop) => childShouldForwardProp(prop) && shouldForwardProp(prop)
  }
  return finalShouldForwardProp
}

const getChildProps = (props, shouldForwardProp, isTag) => {
  const childProps = {}

  for (const prop in props) {
    if (shouldForwardProp) {
      if (shouldForwardProp(prop) === true) {
        childProps[prop] = props[prop]
      }
      continue
    }

    // We don't want to pass non-dom props to the DOM.
    if (isTag) {
      if (isPropValid(prop)) {
        childProps[prop] = props[prop]
      }
      continue
    }

    childProps[prop] = props[prop]
  }

  return childProps
}

// eslint-disable-next-line no-unused-vars
const configureStyled = (tagOrComponent, options = {}) => {
  const {theming} = options
  const isTag = typeof tagOrComponent === 'string'

  const ThemeContext = theming ? theming.context : DefaultThemeContext
  const shouldForwardProp = getShouldForwardProp(tagOrComponent, options)
  const {shouldForwardProp: _, ...hookOptions} = options

  return function createStyledComponent() {
    // eslint-disable-next-line prefer-rest-params
    const {styles, label} = parseStyles(arguments)
    const useStyles = createUseStyles(styles, hookOptions)

    const Styled = (props) => {
      const {as, className} = props
      const theme = React.useContext(ThemeContext)
      const propsWithTheme = Object.assign({theme}, props)
      const classes = useStyles(propsWithTheme)
      const childProps = getChildProps(props, shouldForwardProp, isTag)

      const classNames = `${classes[label] || classes.sc || ''} ${classes.scd || ''}`.trim()
      childProps.className = className ? `${className} ${classNames}` : classNames

      if (!isTag && shouldForwardProp) {
        tagOrComponent[shouldForwardPropSymbol] = shouldForwardProp
      }

      if (isTag && as) {
        return React.createElement(as, childProps)
      }

      return React.createElement(tagOrComponent, childProps)
    }

    return Styled
  }
}

export default configureStyled
