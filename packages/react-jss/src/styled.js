// @flow
/* eslint-disable react/prop-types, react/require-default-props */

import React from 'react'
import isPropValid from '@emotion/is-prop-valid'
import type {StatelessFunctionalComponent, ComponentType} from 'react'
import {useTheme as useThemeDefault} from 'theming'

import createUseStyles from './createUseStyles'
import type {HookOptions, Style} from './types'

// Props we don't want to forward.
const reservedProps = {
  as: true
}

type StyledProps = {
  className?: string,
  as?: string
}

export default <Props: {}>(
  type: string | StatelessFunctionalComponent<Props> | ComponentType<Props>
) => {
  const isTag = typeof type === 'string'

  return <Theme: {}>(style: Style<Theme>, options?: HookOptions<Theme>) => {
    const useStyles = createUseStyles({css: style}, options)
    const useTheme = options && options.theming ? options.theming.useTheme : useThemeDefault

    const Styled = (props: StyledProps) => {
      const {as, className} = props
      const theme = useTheme()
      const classes = useStyles({...props, theme})
      const childProps: Props = ({}: any)
      for (const prop in props) {
        if (prop in reservedProps) continue
        // We don't want to pass non-dom props to the DOM,
        // but we still want to forward them to a users component?
        if (isTag && !isPropValid(prop)) continue
        childProps[prop] = props[prop]
      }
      // $FlowFixMe flow seems to not know that `classes` will be provided by the HOC, not by element creator.
      childProps.className = className ? `${className} ${classes.css}` : classes.css
      return React.createElement(as || type, childProps)
    }

    return Styled
  }
}
