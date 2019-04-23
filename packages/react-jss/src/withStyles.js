// @flow
import React, {Component, type ComponentType, type Node} from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import {type StyleSheet, type Classes} from 'jss'
import {ThemeContext} from 'theming'

import type {HOCProps, HOCOptions, Styles, InnerProps, DynamicRules} from './types'
import getDisplayName from './getDisplayName'
import memoize from './utils/memoizeOne'
import mergeClasses from './utils/mergeClasses'
import JssContext from './JssContext'
import {getIndex} from './utils/indexCounter'
import {
  createStaticSheet,
  updateDynamicRules,
  addDynamicRules,
  removeDynamicRules
} from './utils/sheets'
import {manageSheet, unmanageSheet} from './utils/managers'
import {getSheetClasses} from './utils/getSheetClasses'

interface State {
  dynamicRules: ?DynamicRules;
  sheet: ?StyleSheet;
  classes: {};
}

const NoRenderer = (props: {children?: Node}) => props.children || null

const noTheme = {}

/**
 * HOC creator function that wrapps the user component.
 *
 * `withStyles(styles, [options])(Component)`
 */
const withStyles = <Theme>(styles: Styles<Theme>, options?: HOCOptions<Theme> = {}) => {
  const {index = getIndex(), theming, injectTheme, ...sheetOptions} = options
  const isThemingEnabled = typeof styles === 'function'
  const ThemeConsumer = (theming && theming.context.Consumer) || ThemeContext.Consumer

  return <Props: InnerProps>(
    InnerComponent: ComponentType<Props> = NoRenderer
  ): ComponentType<Props> => {
    const displayName = getDisplayName(InnerComponent)

    const getTheme = (props): Theme => (isThemingEnabled ? props.theme : ((noTheme: any): Theme))

    class WithStyles extends Component<HOCProps<Theme, Props>, State> {
      static displayName = `WithStyles(${displayName})`

      // $FlowFixMe
      static defaultProps = {...InnerComponent.defaultProps}

      static createState(props) {
        const sheet = createStaticSheet({
          styles,
          theme: getTheme(props),
          index,
          name: displayName,
          context: props.jssContext,
          sheetOptions
        })

        if (!sheet) {
          return {classes: {}, dynamicRules: undefined, sheet: undefined}
        }

        const dynamicRules = addDynamicRules(sheet)

        return {
          sheet,
          dynamicRules,
          classes: getSheetClasses(sheet, dynamicRules)
        }
      }

      static manage(props, state) {
        manageSheet({
          sheet: state.sheet,
          index,
          context: props.jssContext,
          theme: getTheme(props)
        })
      }

      static unmanage(props, state) {
        removeDynamicRules(state.sheet, state.dynamicRules)

        unmanageSheet({
          context: props.jssContext,
          index,
          sheet: state.sheet,
          theme: getTheme(props)
        })
      }

      mergeClassesProp = memoize<Classes[], Classes>(
        (sheetClasses, classesProp) =>
          classesProp ? mergeClasses(sheetClasses, classesProp) : sheetClasses
      )

      constructor(props: HOCProps<Theme, Props>) {
        super(props)

        this.state = WithStyles.createState(props)
        WithStyles.manage(props, this.state)
      }

      componentDidUpdate(prevProps: HOCProps<Theme, Props>, prevState: State) {
        if (isThemingEnabled && this.props.theme !== prevProps.theme) {
          const newState = WithStyles.createState(this.props)
          WithStyles.manage(this.props, newState)
          WithStyles.unmanage(prevProps, prevState)

          // eslint-disable-next-line react/no-did-update-set-state
          this.setState(newState)
        } else {
          // Only update the rules when we don't generate a new sheet
          updateDynamicRules(this.props, this.state.sheet, this.state.dynamicRules)
        }
      }

      componentWillUnmount() {
        WithStyles.unmanage(this.props, this.state)
      }

      render() {
        const {innerRef, jssContext, theme, classes, ...rest} = this.props
        const {classes: sheetClasses} = this.state
        const props = {
          ...rest,
          // $FlowFixMe
          classes: this.mergeClassesProp(sheetClasses, classes)
        }

        if (innerRef) props.ref = innerRef
        if (injectTheme) props.theme = theme

        return <InnerComponent {...props} />
      }
    }

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

    JssContextSubscriber.displayName = 'JssContextSubscriber'
    // $FlowFixMe
    JssContextSubscriber.InnerComponent = InnerComponent

    return hoistNonReactStatics(JssContextSubscriber, InnerComponent)
  }
}

export default withStyles
