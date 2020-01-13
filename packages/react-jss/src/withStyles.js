// @flow
import React, {type ComponentType, type Node} from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import {ThemeContext} from 'theming'

import type {HOCOptions, HOCProps, Styles, InnerProps} from './types'
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
  const {injectTheme = false, theming, ...restOptions} = options
  const isThemingEnabled = typeof styles === 'function'
  const ThemeConsumer = (theming && theming.context.Consumer) || ThemeContext.Consumer
  const useStyles = createUseStyles<Theme>(styles, {...restOptions, theming})

  return <Props: InnerProps>(
    InnerComponent: ComponentType<Props> = NoRenderer
  ): ComponentType<Props> => {
    const displayName = getDisplayName(InnerComponent)

    const WithStyles = ({innerRef, ...props}: HOCProps<Theme, Props>) => {
      const classes = useStyles(props)

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
