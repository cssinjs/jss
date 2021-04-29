// @flow
import * as React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import {type StyleSheet, type Classes} from 'jss'
import {ThemeContext as DefaultThemeContext} from 'theming'

import type {HOCProps, HOCOptions, Styles, InnerProps, DynamicRules} from './types'
import getDisplayName from './getDisplayName'
import memoize from './utils/memoizeOne'
import mergeClasses from './utils/mergeClasses'
import getSheetIndex from './utils/getSheetIndex'
import createUseStyles from './createUseStyles'

const NoRenderer = (props: {children?: React.Node}) => props.children || null

type CreateWithStyles = <Theme>(
  Styles<Theme>,
  HOCOptions<Theme> | void
) => <Props: InnerProps>(React.ComponentType<Props>) => React.ComponentType<Props>

/**
 * HOC creator function that wrapps the user component.
 *
 * `withStyles(styles, [options])(Component)`
 */
const createWithStyles: CreateWithStyles = <Theme>(styles, options = {}) => {
  const {index = getSheetIndex(), theming, injectTheme, ...sheetOptions} = options
  const isThemingEnabled = typeof styles === 'function'
  const ThemeContext = theming ? theming.context : GlobalThemeContext

  return <Props: InnerProps>(InnerComponent = NoRenderer) => {
    const displayName = getDisplayName(InnerComponent)

    const mergeClassesProp = memoize(
      (sheetClasses, classesProp): Classes =>
        classesProp ? mergeClasses(sheetClasses, classesProp) : sheetClasses
    )

    const useStyles = createUseStyles(styles, {
      theming,
      index,
      name: displayName,
      ...sheetOptions
    })

    const WithStyles = React.forwardRef((props: HOCProps<Theme, Props>, ref) => {
      const theme = React.useContext(ThemeContext)

      const newProps = {...props}

      if (injectTheme && newProps.theme == null) newProps.theme = theme

      const sheetClasses = useStyles(newProps)

      const classes = mergeClassesProp(sheetClasses, props.classes)

      return <InnerComponent {...newProps} classes={classes} ref={ref} />
    })

    WithStyles.displayName = `WithStyles(${displayName})`
    WithStyles.defaultProps = {...InnerComponent.defaultProps}

    WithStyles.InnerComponent = InnerComponent

    return hoistNonReactStatics(WithStyles, InnerComponent)
  }
}

export default createWithStyles
