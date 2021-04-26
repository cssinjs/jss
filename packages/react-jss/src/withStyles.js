// @flow
import * as React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import {type StyleSheet, type Classes} from 'jss'
import {ThemeContext} from 'theming'

import type {HOCProps, HOCOptions, Styles, InnerProps, DynamicRules} from './types'
import getDisplayName from './getDisplayName'
import memoize from './utils/memoizeOne'
import mergeClasses from './utils/mergeClasses'
import JssContext from './JssContext'
import getSheetIndex from './utils/getSheetIndex'
import {
  createStyleSheet,
  updateDynamicRules,
  addDynamicRules,
  removeDynamicRules
} from './utils/sheets'
import {manageSheet, unmanageSheet} from './utils/managers'
import getSheetClasses from './utils/getSheetClasses'
import createUseStyles from './createUseStyles'

interface State {
  dynamicRules: ?DynamicRules;
  sheet: ?StyleSheet;
  classes: {};
}

const NoRenderer = (props: {children?: React.Node}) => props.children || null

const noTheme = {}

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
  const {index, theming, injectTheme, ...sheetOptions} = options
  const isThemingEnabled = typeof styles === 'function'
  const ThemeConsumer = (theming && theming.context.Consumer) || ThemeContext.Consumer

  return <Props: InnerProps>(InnerComponent = NoRenderer) => {
    const displayName = getDisplayName(InnerComponent)

    const getTheme = (theme): Theme => (isThemingEnabled ? theme : ((noTheme: any): Theme))

    const mergeClassesProp = memoize(
      (sheetClasses, classesProp): Classes =>
        classesProp ? mergeClasses(sheetClasses, classesProp) : sheetClasses
    )

    const WithStyles = props => {
      const useStyle = React.useMemo(
        () =>
          createUseStyles(styles, {
            theme: getTheme(props.theme),
            index,
            name: displayName,
            context: props.jssContext,
            sheetOptions
          }),
        [styles, props.theme, index, displayName, props.jssContext, sheetOptions]
      )

      const sheetClasses = useStyle(props)

      const {innerRef, jssContext, theme, classes, ...rest} = props
      const newProps = {
        ...rest,
        classes: mergeClassesProp(sheetClasses, classes)
      }

      if (innerRef) props.ref = innerRef
      if (injectTheme) newProps.theme = theme

      return <InnerComponent {...newProps} />
    }

    WithStyles.displayName = `WithStyles(${displayName})`
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

          return <WithStyles innerRef={ref} {...props} jssContext={context} theme={noTheme} />
        }}
      </JssContext.Consumer>
    ))

    JssContextSubscriber.displayName = `JssContextSubscriber(${displayName})`
    // $FlowFixMe[prop-missing] - React's types should allow custom static properties on component.
    JssContextSubscriber.InnerComponent = InnerComponent

    return hoistNonReactStatics(JssContextSubscriber, InnerComponent)
  }
}

export default createWithStyles
