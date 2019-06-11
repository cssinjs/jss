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

const getStyles = args => {
  let staticStyle
  const dynamicStyles = []
  args.forEach(style => {
    if (typeof style === 'function') {
      dynamicStyles.push(style)
    } else {
      staticStyle = Object.assign(staticStyle || {}, style)
    }
  })
  const styles = {}
  let ruleNr = 0
  if (staticStyle) {
    // Making sure static style comes first.
    styles.css = staticStyle
    ruleNr++
  }
  if (dynamicStyles.length !== 0) {
    dynamicStyles.forEach(style => {
      styles[`css${ruleNr === 0 ? '' : ruleNr}`] = style
      ruleNr++
    })
  }
  return styles
}

type StyledOptions<Theme> = HookOptions<Theme> & {
  shouldForwardProp?: string => boolean
}

export default <Props: StyledProps, Theme: {}>(
  type: string | StatelessFunctionalComponent<Props> | ComponentType<Props>,
  options?: StyledOptions<Theme> = {}
) => {
  const {theming, shouldForwardProp} = options
  const isTagName = typeof type === 'string'
  const ThemeContext = theming ? theming.context : DefaultThemeContext

  return (...args: Array<StaticStyle | DynamicStyle<Theme>>) => {
    const useStyles = createUseStyles(getStyles(args), options)

    const Styled = (props: StyledProps) => {
      const {as, className} = props
      // $FlowFixMe theming ThemeContext types need to be fixed.
      const theme = React.useContext(ThemeContext)
      const classes = useStyles({...props, theme})
      const childProps: Props = ({}: any)
      for (const prop in props) {
        // We don't want to pass non-dom props to the DOM,
        // but we still want to forward them to a users component.
        if (isTagName && !isPropValid(prop)) continue
        if (shouldForwardProp && shouldForwardProp(prop) === false) continue
        childProps[prop] = props[prop]
      }
      const classNames = Object.values(classes).join(' ')
      childProps.className = className ? `${className} ${classNames}` : classNames

      return React.createElement(as || type, childProps)
    }

    return Styled
  }
}
