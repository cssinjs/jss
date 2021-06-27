// @flow
import * as React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import {type Classes} from 'jss'
import {ThemeContext as DefaultThemeContext} from 'theming'

import type {HOCProps, HOCOptions, Styles, InnerProps} from './types'
import getDisplayName from './getDisplayName'
import memoize from './utils/memoizeOne'
import mergeClasses from './utils/mergeClasses'
import getSheetIndex from './utils/getSheetIndex'
import createUseStyles from './createUseStyles'

const NoRenderer = (props: {children?: React.Node}) => props.children || null

type CreateWithStyles = <Theme: {}>(Styles<Theme>, HOCOptions<Theme> | void) => any => Classes

/**
 * HOC creator function that wrapps the user component.
 *
 * `withStyles(styles, [options])(Component)`
 */

const createWithStyles: CreateWithStyles = <Theme>(styles, options = {}) => {
  const {index = getSheetIndex(), theming, injectTheme, ...sheetOptions} = options
  const ThemeContext = theming ? theming.context : DefaultThemeContext

  return <Props: InnerProps>(InnerComponent = NoRenderer) => {
    const displayName = getDisplayName(InnerComponent)

    const mergeClassesProp = memoize(
      (sheetClasses, classesProp): Classes =>
        classesProp ? mergeClasses(sheetClasses, classesProp) : sheetClasses
    )

    const hookOptions = Object.assign((sheetOptions: any), {
      theming,
      index,
      name: displayName
    })

    const useStyles = createUseStyles(styles, hookOptions)

    const WithStyles = React.forwardRef((props: HOCProps<Theme, Props>, ref) => {
      const theme = React.useContext(ThemeContext)

      const newProps: Props & {theme: any} = {...props}

      if (injectTheme && newProps.theme == null) {
        newProps.theme = theme
      }

      const sheetClasses = useStyles(newProps)

      const classes = mergeClassesProp(sheetClasses, props.classes)

      return <InnerComponent {...newProps} classes={classes} ref={ref} />
    })

    WithStyles.displayName = `WithStyles(${displayName})`

    // $FlowFixMe[prop-missing] https://github.com/facebook/flow/issues/7467
    WithStyles.defaultProps = {...InnerComponent.defaultProps}

    // $FlowFixMe[prop-missing]
    WithStyles.InnerComponent = InnerComponent

    return hoistNonReactStatics(WithStyles, InnerComponent)
  }
}

export default createWithStyles
