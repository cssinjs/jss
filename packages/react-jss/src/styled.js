// @flow
/* eslint-disable react/prop-types, react/require-default-props */

import React from 'react'
import isPropValid from '@emotion/is-prop-valid'
import type {StatelessFunctionalComponent, ComponentType} from 'react'
import withStyles from './withStyles'
import type {HookOptions, Style, Classes} from './types'

// Props we don't want to forward.
const reservedProps = {
  classes: true,
  as: true,
  theme: true
}

type StyledProps = {
  className?: string,
  as?: string,
  classes?: Classes
}

export default <Props: {}>(
  type: string | StatelessFunctionalComponent<Props> | ComponentType<Props>
) => {
  const isTag = typeof type === 'string'

  return <Theme: {}>(style: Style<Theme>, options?: HookOptions<Theme>) => {
    const Styled = (props: StyledProps) => {
      const {classes, as, className} = props
      const childProps: Props = ({}: any)
      for (const prop in props) {
        if (prop in reservedProps) continue
        // We don't want to pass non-dom props to the DOM,
        // but we still wat to forward them to a uses component.
        if (isTag && !isPropValid(prop)) continue
        childProps[prop] = props[prop]
      }
      // $FlowFixMe flow seems to not know that `classes` will be provided by the HOC, not by element creator.
      childProps.className = className ? `${className} ${classes.css}` : classes.css
      return React.createElement(as || type, childProps)
    }

    // $FlowFixMe flow seems to not know that `classes` will be provided by the HOC, not by element creator.
    return withStyles({css: style}, {...options, injectTheme: true})(Styled)
  }
}
