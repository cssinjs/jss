// @flow
import React, {type ComponentType, type Node} from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import {ThemeContext as DefaultThemeContext} from 'theming'

import type {HOCOptions, HOCProps, Styles, InnerProps, Classes} from './types'
import mergeClasses from './utils/mergeClasses'
import getDisplayName from './getDisplayName'
import createUseStyles from './createUseStyles'

const NoRenderer = (props: {children?: Node}) => props.children || null

/**
 * HOC creator function that wrapps the user component.
 *
 * `withStyles(styles, [options])(Component)`
 */
const withStyles = <Theme: {}>(styles: Styles<Theme>, options?: HOCOptions<Theme> = {}) => {
  const {injectTheme = false, theming, name, ...restOptions} = options
  const ThemeContext = (theming && theming.context) || DefaultThemeContext

  return <Props: HOCProps<Theme, InnerProps>>(
    InnerComponent: ComponentType<Props> = NoRenderer
  ): ComponentType<Props> => {
    const displayName = getDisplayName(InnerComponent)
    const useStyles = createUseStyles<Theme>(styles, {
      ...restOptions,
      name: name || displayName,
      theming
    })

    const WithStyles = React.forwardRef(
      ({classes: propClasses, theme: propTheme, ...restProps}: Props, ref) => {
        // $FlowFixMe
        const contextTheme = React.useContext(ThemeContext)
        const theme = propTheme || contextTheme
        const generatedClasses = useStyles({theme, ...restProps})
        const classes: Classes = React.useMemo(
          () => (propClasses ? mergeClasses(generatedClasses, propClasses) : generatedClasses),
          [propClasses, generatedClasses]
        )

        const props = Object.assign({}, {ref, classes}, restProps)

        if (injectTheme) {
          props.theme = theme
        }

        return <InnerComponent {...props} />
      }
    )

    // $FlowFixMe
    WithStyles.defaultProps = {...InnerComponent.defaultProps}
    WithStyles.displayName = `WithStyles(${displayName})`
    // $FlowFixMe - React's types should allow custom static properties on component.
    WithStyles.InnerComponent = InnerComponent

    return hoistNonReactStatics(WithStyles, InnerComponent)
  }
}

export default withStyles
