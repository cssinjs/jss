import * as React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import {ThemeContext as DefaultThemeContext} from 'theming'
import getDisplayName from './getDisplayName'
import memoize from './utils/memoizeOne'
import mergeClasses from './utils/mergeClasses'
import getSheetIndex from './utils/getSheetIndex'
import createUseStyles from './createUseStyles'

const NoRenderer = (props) => props.children || null

/**
 * HOC creator function that wrapps the user component.
 *
 * `withStyles(styles, [options])(Component)`
 */

const createWithStyles = (styles, options = {}) => {
  const {index = getSheetIndex(), theming, injectTheme, ...sheetOptions} = options
  const ThemeContext = theming ? theming.context : DefaultThemeContext

  return (InnerComponent = NoRenderer) => {
    const displayName = getDisplayName(InnerComponent)

    const mergeClassesProp = memoize((sheetClasses, classesProp) =>
      classesProp ? mergeClasses(sheetClasses, classesProp) : sheetClasses
    )

    const hookOptions = Object.assign(sheetOptions, {
      theming,
      index,
      name: displayName
    })

    const useStyles = createUseStyles(styles, hookOptions)

    const WithStyles = React.forwardRef((props, ref) => {
      const theme = React.useContext(ThemeContext)

      const newProps = {...props}

      if (injectTheme && newProps.theme == null) {
        newProps.theme = theme
      }

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
