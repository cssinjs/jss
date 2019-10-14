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
import getSheetIndex from './utils/getSheetIndex'
import {
  createStyleSheet,
  updateDynamicRules,
  addDynamicRules,
  removeDynamicRules
} from './utils/sheets'
import {manageSheet, unmanageSheet} from './utils/managers'
import getSheetClasses from './utils/getSheetClasses'

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
  const {index = getSheetIndex(), theming, injectTheme, ...sheetOptions} = options
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
        const sheet = createStyleSheet({
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

        const dynamicRules = addDynamicRules(sheet, props)

        return {
          sheet,
          dynamicRules,
          classes: getSheetClasses(sheet, dynamicRules)
        }
      }

      static manage(props, state) {
        const {sheet} = state
        if (sheet) {
          manageSheet({
            sheet,
            index,
            context: props.jssContext,
            theme: getTheme(props)
          })
        }
      }

      static unmanage(props, state) {
        const {sheet, dynamicRules} = state

        if (sheet) {
          unmanageSheet({
            context: props.jssContext,
            index,
            sheet,
            theme: getTheme(props)
          })

          if (dynamicRules) {
            removeDynamicRules(sheet, dynamicRules)
          }
        }
      }

      mergeClassesProp = memoize(
        (sheetClasses, classesProp): Classes =>
          classesProp ? mergeClasses(sheetClasses, classesProp) : sheetClasses
      )

      constructor(props: HOCProps<Theme, Props>) {
        super(props)

        this.state = WithStyles.createState(props)
        const {registry} = props.jssContext
        const {sheet} = this.state
        if (sheet && registry) {
          registry.add(sheet)
        }
      }

      componentDidMount() {
        const {props, state} = this
        if (props && state) {
          WithStyles.manage(props, state)
        }
      }

      componentDidUpdate(prevProps: HOCProps<Theme, Props>, prevState: State) {
        if (isThemingEnabled && this.props.theme !== prevProps.theme) {
          const newState = WithStyles.createState(this.props)
          WithStyles.manage(this.props, newState)
          WithStyles.unmanage(prevProps, prevState)

          // eslint-disable-next-line react/no-did-update-set-state
          this.setState(newState)
        } else if (this.state.sheet && this.state.dynamicRules) {
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

    JssContextSubscriber.displayName = `JssContextSubscriber(${displayName})`
    // $FlowFixMe - React's types should allow custom static properties on component.
    JssContextSubscriber.InnerComponent = InnerComponent

    return hoistNonReactStatics(JssContextSubscriber, InnerComponent)
  }
}

export default withStyles
