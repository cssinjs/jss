// @flow
import React, {Component, type ComponentType, type Node} from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import {type StyleSheet} from 'jss'
import {ThemeContext} from 'theming'

import type {HOCProps, HOCOptions, Styles, InnerProps, DynamicRules} from '../types'
import getDisplayName from './getDisplayName'
import memoize from '../memoize-one'
import mergeClasses from '../merge-classes'
import JssContext from '../JssContext'
import {getIndex} from '../utils/index-counter'
import {createSheet} from '../utils/create-sheet'

interface State {
  dynamicRules?: ?DynamicRules;
  sheet?: StyleSheet;
  classes: {};
}

const NoRenderer = (props: {children?: Node}) => props.children || null

const noTheme = {}

/**
 * HOC creator function that wrapps the user component.
 *
 * `withStyles(styles, [options])(Component)`
 */
export default function withStyles<Theme: {}>(
  styles: Styles<Theme>,
  options?: HOCOptions<Theme> = {}
) {
  const {index = getIndex(), theming, injectTheme} = options
  const isThemingEnabled = typeof styles === 'function'
  const ThemeConsumer = (theming && theming.context.Consumer) || ThemeContext.Consumer

  return <Props: InnerProps>(
    InnerComponent: ComponentType<Props> = NoRenderer
  ): ComponentType<Props> => {
    const displayName = getDisplayName(InnerComponent)

    class WithStyles extends Component<HOCProps<Theme, Props>, State> {
      static displayName = `WithStyles(${displayName})`

      // $FlowFixMe
      static defaultProps = {...InnerComponent.defaultProps}

      static getSheetClasses(sheet, dynamicRules: ?DynamicRules) {
        const classes = {}

        // $FlowFixMe
        for (const key in sheet.styles) {
          classes[key] = sheet.classes[key]

          if (dynamicRules && key in dynamicRules) {
            classes[key] += ` ${sheet.classes[dynamicRules[key].key]}`
          }
        }

        return classes
      }

      static updateDynamicRules(props: HOCProps<Theme, Props>, {dynamicRules, sheet}: State) {
        if (!sheet) {
          return
        }

        // Loop over each dynamic rule and update it
        // We can't just update the whole sheet as this has all of the rules for every component instance
        for (const key in dynamicRules) {
          // $FlowFixMe: Not sure why it throws an error here
          sheet.update(dynamicRules[key].key, props)
        }
      }

      static removeDynamicRules(props: Props, {dynamicRules, sheet}: State) {
        if (!sheet) {
          return
        }

        // Loop over each dynamic rule and remove the dynamic rule
        // We can't just remove the whole sheet as this has all of the rules for every component instance
        for (const key in dynamicRules) {
          sheet.deleteRule(dynamicRules[key].key)
        }
      }

      static addDynamicStyles(sheet: StyleSheet): ?DynamicRules {
        // $FlowFixMe Cannot access random fields on instance of class StyleSheet
        if (!sheet.dynamicStyles) return undefined

        const rules: DynamicRules = {}

        // Loop over each dynamic rule and add it to the stylesheet
        for (const key in sheet.dynamicStyles) {
          // $FlowFixMe
          const ruleKey = `${key}-${sheet.dynamicRuleCounter++}`
          const rule = sheet.addRule(ruleKey, sheet.dynamicStyles[key])

          if (rule) {
            rules[key] = rule
          }
        }

        return rules
      }

      mergeClassesProp = memoize(
        (sheetClasses, classesProp) =>
          classesProp ? mergeClasses(sheetClasses, classesProp) : sheetClasses
      )

      constructor(props: HOCProps<Theme, Props>) {
        super(props)

        this.state = this.createState()
        this.manage(props, this.state)
      }

      componentDidUpdate(prevProps: HOCProps<Theme, Props>, prevState: State) {
        WithStyles.updateDynamicRules(this.props, this.state)

        if (isThemingEnabled && this.props.theme !== prevProps.theme) {
          const newState = this.createState()
          this.manage(this.props, newState)
          this.unmanage(prevProps, prevState)

          // eslint-disable-next-line react/no-did-update-set-state
          this.setState(newState)
        }
      }

      componentWillUnmount() {
        this.unmanage(this.props, this.state)
      }

      classNamePrefix: string

      manage(props, state) {
        const {sheet} = state
        const {registry} = props.jssContext

        if (!sheet) {
          return
        }

        WithStyles.updateDynamicRules(props, state)

        this.manager.manage(getTheme(props))
        if (registry) {
          registry.add(sheet)
        }
      }

      unmanage(props, state: State) {
        WithStyles.removeDynamicRules(props, state)

        this.manager.unmanage(getTheme(props))
      }

      createState(): State {
        const sheet = createSheet({
          styles,
          theme: this.props.theme,
          index,
          name: displayName,
          jssContext: this.props.jssContext,
        });

        if (!sheet) {
          return {classes: {}}
        }

        const dynamicRules = WithStyles.addDynamicStyles(sheet)

        return {
          sheet,
          dynamicRules,
          classes: WithStyles.getSheetClasses(sheet, dynamicRules)
        }
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

          return <WithStyles
            innerRef={ref}
            {...props}
            jssContext={context}
            theme={noTheme}
          />
        }}
      </JssContext.Consumer>
    ))

    JssContextSubscriber.displayName = 'JssContextSubscriber'
    JssContextSubscriber.InnerComponent = InnerComponent

    return hoistNonReactStatics(JssContextSubscriber, InnerComponent)
  }
}
