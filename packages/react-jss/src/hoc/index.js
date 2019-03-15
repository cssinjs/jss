// @flow
import React, {Component, type ComponentType, type Node} from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import {type StyleSheet} from 'jss'
import {ThemeContext} from 'theming'

import type {HOCProps, HOCOptions, Styles, InnerProps, DynamicRules} from '../types'
import getDisplayName from './getDisplayName'
import memoize from '../utils/memoize-one'
import mergeClasses from '../utils/merge-classes'
import {JssContext} from '../JssContext'
import {getIndex} from '../utils/index-counter'
import {createSheet} from '../utils/create-sheet'
import {addDynamicRules, removeDynamicRules, updateDynamicRules} from '../utils/dynamic-rules'
import {unmanageSheet} from '../utils/unmanage-sheet'
import {manageSheet} from '../utils/manage-sheet'
import {getSheetClasses} from '../utils/get-sheet-classes'

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
export function withStyles<Theme>(styles: Styles<Theme>, options?: HOCOptions<Theme> = {}) {
  const {index = getIndex(), theming, injectTheme, ...sheetOptions} = options
  const isThemingEnabled = typeof styles === 'function'
  const ThemeConsumer = (theming && theming.context.Consumer) || ThemeContext.Consumer

  return <Props: InnerProps>(
    InnerComponent: ComponentType<Props> = NoRenderer
  ): ComponentType<Props> => {
    const displayName = getDisplayName(InnerComponent)

    const getTheme = (props): Theme => isThemingEnabled ? props.theme : noTheme

    class WithStyles extends Component<HOCProps<Theme, Props>, State> {
      static displayName = `WithStyles(${displayName})`

      // $FlowFixMe
      static defaultProps = {...InnerComponent.defaultProps}

      static createState(props) {
        const sheet = createSheet({
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

      mergeClassesProp = memoize(
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
          classes: this.mergeClassesProp(sheetClasses, classes)
        }

        if (innerRef) props.ref = innerRef
        if (injectTheme) props.theme = theme

        return <InnerComponent {...props} />
      }
    }

    // $FlowFixMe: Sadly there is no support for forwardRef yet
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
    JssContextSubscriber.InnerComponent = InnerComponent

    return hoistNonReactStatics(JssContextSubscriber, InnerComponent)
  }
}
