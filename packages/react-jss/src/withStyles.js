// @flow
import React, {Component, type ComponentType, type Node} from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import {getDynamicStyles, SheetsManager, type StyleSheet} from 'jss'
import {ThemeContext} from 'theming'

import type {HOCProps, Options, Styles, InnerProps} from './types'
import getDisplayName from './getDisplayName'
import memoize from './memoize-one'
import mergeClasses from './merge-classes'
import defaultJss from './jss'
import JssContext from './JssContext'

const dynamicStylesNS = Symbol.for('dynamicStyles')

type State = {
  dynamicSheet?: StyleSheet,
  staticSheet?: StyleSheet,
  classes: {}
}

/**
 * Global index counter to preserve source order.
 * As we create the style sheet during componentWillMount lifecycle,
 * children are handled after the parents, so the order of style elements would
 * be parent->child. It is a problem though when a parent passes a className
 * which needs to override any childs styles. StyleSheet of the child has a higher
 * specificity, because of the source order.
 * So our solution is to render sheets them in the reverse order child->sheet, so
 * that parent has a higher specificity.
 */
let indexCounter = -100000

let managersCounter = 0

const NoRenderer = (props: {children?: Node}) => props.children || null

const getStyles = <Theme: {}>(styles: Styles<Theme>, theme: Theme) => {
  if (typeof styles !== 'function') {
    return styles
  }
  return styles(theme)
}

/**
 * HOC creator function that wrapps the user component.
 *
 * `withStyles(styles, [options])(Component)`
 */
export default function withStyles<Theme: {}, S: Styles<Theme>>(
  styles: S,
  options?: Options<Theme> = {}
) {
  const {index = indexCounter++, theming, injectTheme, jss: optionsJss, ...sheetOptions} = options
  const isThemingEnabled = typeof styles === 'function'
  const ThemeConsumer = (theming && theming.context.Consumer) || ThemeContext.Consumer

  return <Props: InnerProps>(
    InnerComponent: ComponentType<Props> = NoRenderer
  ): ComponentType<Props> => {
    const displayName = getDisplayName(InnerComponent)
    const defaultClassNamePrefix = process.env.NODE_ENV === 'production' ? '' : `${displayName}-`
    const managerId = managersCounter++
    const manager = new SheetsManager()
    const noTheme = {}
    // $FlowFixMe
    const getTheme = (props: HOCProps<Theme, Props>): Theme =>
      isThemingEnabled && props.theme ? props.theme : noTheme

    class WithStyles extends Component<HOCProps<Theme, Props>, State> {
      static displayName = `WithStyles(${displayName})`

      // $FlowFixMe
      static defaultProps = {...InnerComponent.defaultProps}

      mergeClassesProp = memoize(
        (sheetClasses, classesProp) =>
          classesProp ? mergeClasses(sheetClasses, classesProp) : sheetClasses
      )

      constructor(props: HOCProps<Theme, Props>) {
        super(props)

        const {sheetOptions: contextSheetOptions} = props.jssContext

        this.classNamePrefix = (contextSheetOptions.classNamePrefix || '') + defaultClassNamePrefix

        this.state = this.createState()
        this.manage(props, this.state)
      }

      componentDidUpdate(prevProps: HOCProps<Theme, Props>, prevState: State) {
        const {dynamicSheet} = this.state
        if (dynamicSheet) dynamicSheet.update(this.props)

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

      get jss() {
        return this.props.jssContext.jss || optionsJss || defaultJss
      }

      get manager(): SheetsManager {
        const {managers} = this.props.jssContext

        // If `managers` map is present in the context, we use it in order to
        // let JssProvider reset them when new response has to render server-side.
        if (managers) {
          if (!managers[managerId]) {
            managers[managerId] = new SheetsManager()
          }
          return managers[managerId]
        }

        return manager
      }

      getStaticSheet(): StyleSheet {
        const theme = getTheme(this.props)
        let staticSheet = this.manager.get(theme)

        if (staticSheet) {
          return staticSheet
        }

        const themedStyles = getStyles(styles, theme)
        const contextSheetOptions = this.props.jssContext.sheetOptions
        staticSheet = this.jss.createStyleSheet(themedStyles, {
          ...sheetOptions,
          ...contextSheetOptions,
          index,
          meta: `${displayName}, ${isThemingEnabled ? 'Themed' : 'Unthemed'}, Static`,
          classNamePrefix: this.classNamePrefix
        })
        this.manager.add(theme, staticSheet)
        // $FlowFixMe Cannot add random fields to instance of class StyleSheet
        staticSheet[dynamicStylesNS] = getDynamicStyles(themedStyles)

        return staticSheet
      }

      getDynamicSheet(staticSheet: StyleSheet): StyleSheet | void {
        // $FlowFixMe Cannot access random fields on instance of class StyleSheet
        const dynamicStyles = staticSheet[dynamicStylesNS]

        if (!dynamicStyles) return undefined

        const contextSheetOptions = this.props.jssContext.sheetOptions

        return this.jss.createStyleSheet(dynamicStyles, {
          ...sheetOptions,
          ...contextSheetOptions,
          index,
          meta: `${displayName}, ${isThemingEnabled ? 'Themed' : 'Unthemed'}, Dynamic`,
          classNamePrefix: this.classNamePrefix,
          link: true
        })
      }

      classNamePrefix: string

      manage(props, state) {
        const {dynamicSheet, staticSheet} = state
        const {registry} = props.jssContext

        if (!staticSheet) {
          return
        }

        this.manager.manage(getTheme(props))
        if (registry) {
          registry.add(staticSheet)
        }

        if (dynamicSheet) {
          dynamicSheet.update(props).attach()

          if (registry) {
            registry.add(dynamicSheet)
          }
        }
      }

      unmanage(props, state) {
        this.manager.unmanage(getTheme(props))

        if (state.dynamicSheet) {
          this.jss.removeStyleSheet(state.dynamicSheet)
        }
      }

      createState(): State {
        if (this.props.jssContext.disableStylesGeneration) {
          return {classes: {}}
        }

        const staticSheet = this.getStaticSheet()
        const dynamicSheet = this.getDynamicSheet(staticSheet)

        return {
          staticSheet,
          dynamicSheet,
          classes: dynamicSheet
            ? mergeClasses(staticSheet.classes, dynamicSheet.classes)
            : staticSheet.classes
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

          return <WithStyles innerRef={ref} {...props} jssContext={context} />
        }}
      </JssContext.Consumer>
    ))

    JssContextSubscriber.displayName = 'JssContextSubscriber'
    JssContextSubscriber.InnerComponent = InnerComponent

    return hoistNonReactStatics(JssContextSubscriber, InnerComponent)
  }
}
