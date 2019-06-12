// @flow
/* eslint-disable react/prop-types, react/require-default-props */

import React from 'react'
import isPropValid from '@emotion/is-prop-valid'
import type {StatelessFunctionalComponent, ComponentType} from 'react'
import {ThemeContext as DefaultThemeContext} from 'theming'

import createUseStyles from './createUseStyles'
import type {HookOptions, StaticStyle, DynamicStyle} from './types'

type StyledProps = {
  className?: string,
  as?: string
}

type StyleArg<Theme> = StaticStyle | DynamicStyle<Theme> | null | void | ''

const parseStyles = <Theme>(args: {[string]: StyleArg<Theme>}) => {
  const dynamicStyles = []
  let staticStyle
  let label = 'css'

  // Not using ...rest to optimize perf.
  for (const key in args) {
    const style = args[key]
    if (!style) continue
    if (typeof style === 'function') {
      dynamicStyles.push(style)
    } else {
      if (!staticStyle) staticStyle = {}
      Object.assign(staticStyle, style)
      if ('label' in staticStyle) {
        // Label could potentially be defined in each style object,
        // so we take the first one and ignore every subsequent one.
        if (label === 'css') label = staticStyle.label
        // Label should not leak to the core.
        delete staticStyle.label
      }
    }
  }

  const styles = {}

  if (staticStyle) styles[label] = staticStyle

  // When there is only one function rule, we don't need to wrap it.
  if (dynamicStyles.length === 1) {
    styles.cssd = dynamicStyles[0]
  }

  // We create a new function rule which will call all other function rules
  // and merge the styles they return.
  if (dynamicStyles.length > 1) {
    styles.cssd = props => {
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

type StyledOptions<Theme> = HookOptions<Theme> & {
  shouldForwardProp?: string => boolean
}

export default <Theme: {}>(
  type: string | StatelessFunctionalComponent<StyledProps> | ComponentType<StyledProps>,
  options?: StyledOptions<Theme> = {}
) => {
  const {theming, shouldForwardProp} = options
  const isTagName = typeof type === 'string'
  const ThemeContext = theming ? theming.context : DefaultThemeContext

  return function StyledFactory(/* :: ...args: StyleArg<Theme>[] */): StatelessFunctionalComponent<
    StyledProps
  > {
    // eslint-disable-next-line prefer-rest-params
    const {styles, label} = parseStyles(arguments)

    const useStyles = createUseStyles(styles, label ? {...options, name: label} : options)

    const Styled = (props: StyledProps) => {
      const {as, className} = props
      // $FlowFixMe theming ThemeContext types need to be fixed.
      const theme = React.useContext(ThemeContext)
      const classes = useStyles({...props, theme})
      const childProps: StyledProps = ({}: any)

      for (const prop in props) {
        // We don't want to pass non-dom props to the DOM,
        // but we still want to forward them to a users component.
        if (isTagName && !isPropValid(prop)) continue
        if (shouldForwardProp && shouldForwardProp(prop) === false) continue
        childProps[prop] = props[prop]
      }
      // $FlowIgnore we don't care label might not exist in classes.
      const classNames = `${classes[label] || classes.css || ''} ${classes.cssd || ''}`.trim()
      childProps.className = className ? `${className} ${classNames}` : classNames

      return React.createElement(as || type, childProps)
    }

    return Styled
  }
}
