// @flow
import React, {type ComponentType, type Node} from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import {ThemeContext} from 'theming'

import type {HOCOptions, HOCProps, Styles, InnerProps} from './types'
import mergeClasses from './utils/mergeClasses'
import JssContext from './JssContext'
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
  const isThemingEnabled = typeof styles === 'function'
  const ThemeConsumer = (theming && theming.context.Consumer) || ThemeContext.Consumer

  return <Props: InnerProps>(
    InnerComponent: ComponentType<Props> = NoRenderer
  ): ComponentType<Props> => {
    const displayName = getDisplayName(InnerComponent)
    const useStyles = createUseStyles<Theme>(styles, {
      ...restOptions,
      name: name || displayName,
      theming
    })

    const WithStyles = ({innerRef, classes: propClasses, ...props}: HOCProps<Theme, Props>) => {
      const generatedClasses = useStyles(props)
      const classes = React.useMemo(
        () => (propClasses ? mergeClasses(generatedClasses, propClasses) : generatedClasses),
        [propClasses, generatedClasses]
      )

      return <InnerComponent ref={innerRef} {...props} classes={classes} />
    }

    // $FlowFixMe
    WithStyles.defaultProps = {...InnerComponent.defaultProps}

    const JssContextSubscriber = React.forwardRef((props, ref) => (
      <JssContext.Consumer>
        {context => {
          if (isThemingEnabled || injectTheme) {
            return (
              <ThemeConsumer>
                {theme => (
                  <WithStyles innerRef={ref} theme={theme} {...props} jssContext={context} />
                )}
              </ThemeConsumer>
            )
          }

          return <WithStyles innerRef={ref} {...props} jssContext={context} theme={undefined} />
        }}
      </JssContext.Consumer>
    ))

    JssContextSubscriber.displayName = `JssContextSubscriber(${displayName})`
    // $FlowFixMe - React's types should allow custom static properties on component.
    JssContextSubscriber.InnerComponent = InnerComponent

    return hoistNonReactStatics(JssContextSubscriber, InnerComponent)
  }
}

export default withStyles
