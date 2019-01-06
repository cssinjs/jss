// @flow
/* eslint-disable react/destructuring-assignment */
import React, {Component, type ComponentType} from 'react'
import PropTypes from 'prop-types'
import {ThemeContext} from 'theming'
import {getDynamicStyles, SheetsManager, type StyleSheet} from 'jss'
import defaultJss from './jss'
import mergeClasses from './merge-classes'
import getDisplayName from './getDisplayName'
import JssContext from './JssContext'
import type {Options, Theme, StylesOrCreator, InnerProps, OuterProps} from './types'
import memoize from './memoize-one'

// Like a Symbol
const dynamicStylesNs = Math.random()

/*
 * # Use cases
 *
 * - Unthemed component accepts styles object
 * - Themed component accepts styles creator function which takes theme as a single argument
 * - Multiple instances will re-use the same static sheet via sheets manager
 * - Sheet manager identifies static sheets by theme as a key
 * - For unthemed components theme is an empty object
 * - The very first instance will add static sheet to sheets manager
 * - Every further instances will get that static sheet from sheet manager
 * - Every mount of every instance will call method `sheetsManager.manage`,
 * thus incrementing reference counter.
 * - Every unmount of every instance will call method `sheetsManager.unmanage`,
 * thus decrementing reference counter.
 * - `sheetsManager.unmanage` under the hood will detach static sheet once reference
 * counter is zero.
 * - Dynamic styles are not shared between instances
 *
 */

type State = {|
  dynamicSheet?: StyleSheet,
  staticSheet?: StyleSheet,
  classes: {}
|}

const getStyles = (stylesOrCreator: StylesOrCreator, theme: Theme) => {
  if (typeof stylesOrCreator !== 'function') {
    return stylesOrCreator
  }
  return stylesOrCreator(theme)
}

let managersCounter = 0

export default function createHOC<
  InnerPropsType: InnerProps,
  InnerComponentType: ComponentType<InnerPropsType>,
  OuterPropsType: OuterProps<InnerPropsType, InnerComponentType>
>(
  stylesOrCreator: StylesOrCreator,
  InnerComponent: InnerComponentType,
  options: Options
): ComponentType<OuterPropsType> {
  const isThemingEnabled = typeof stylesOrCreator === 'function'
  const {theming, injectTheme, jss: optionsJss, ...sheetOptions} = options
  const displayName = getDisplayName(InnerComponent)
  const defaultClassNamePrefix = process.env.NODE_ENV === 'production' ? '' : `${displayName}-`
  const noTheme = {}
  const managerId = managersCounter++
  const manager = new SheetsManager()
  const ThemeConsumer = (theming && theming.context.Consumer) || ThemeContext.Consumer

  const getTheme = props => (isThemingEnabled && props.theme ? props.theme : noTheme)

  class Jss extends Component<OuterPropsType, State> {
    static displayName = `Jss(${displayName})`

    static propTypes = {
      innerRef: PropTypes.func
    }

    // $FlowFixMe
    static defaultProps = {...InnerComponent.defaultProps}

    mergeClassesProp = memoize(
      (sheetClasses, classesProp) =>
        classesProp ? mergeClasses(sheetClasses, classesProp) : sheetClasses
    )

    constructor(props: OuterPropsType) {
      super(props)

      const {sheetOptions: contextSheetOptions} = props.jssContext

      this.classNamePrefix = (contextSheetOptions.classNamePrefix || '') + defaultClassNamePrefix

      this.state = this.createState()
      this.manage(props, this.state)
    }

    componentDidUpdate(prevProps: OuterPropsType, prevState: State) {
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

      const contextSheetOptions = this.props.jssContext.sheetOptions
      const styles = getStyles(stylesOrCreator, theme)
      staticSheet = this.jss.createStyleSheet(styles, {
        ...sheetOptions,
        ...contextSheetOptions,
        meta: `${displayName}, ${isThemingEnabled ? 'Themed' : 'Unthemed'}, Static`,
        classNamePrefix: this.classNamePrefix
      })
      this.manager.add(theme, staticSheet)
      // $FlowFixMe Cannot add random fields to instance of class StyleSheet
      staticSheet[dynamicStylesNs] = getDynamicStyles(styles)

      return staticSheet
    }

    getDynamicSheet(staticSheet: StyleSheet): StyleSheet | void {
      // $FlowFixMe Cannot access random fields on instance of class StyleSheet
      const dynamicStyles = staticSheet[dynamicStylesNs]

      if (!dynamicStyles) return undefined

      const contextSheetOptions = this.props.jssContext.sheetOptions

      return this.jss.createStyleSheet(dynamicStyles, {
        ...sheetOptions,
        ...contextSheetOptions,
        meta: `${displayName}, ${isThemingEnabled ? 'Themed' : 'Unthemed'}, Dynamic`,
        classNamePrefix: this.classNamePrefix,
        link: true
      })
    }

    classNamePrefix: string

    manage(props, state) {
      const {dynamicSheet, staticSheet} = state
      const {registry} = props.jssContext

      this.manager.manage(getTheme(props))
      if (staticSheet && registry) {
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
      const {
        innerRef,
        jssContext,
        theme,
        classes: userClasses,
        // $FlowFixMe: Flow complains for no reason...
        ...props
      } = this.props
      const {classes: sheetClasses} = this.state

      // Merge the class names for the user into the sheet classes
      props.classes = this.mergeClassesProp(sheetClasses, userClasses)

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
              {theme => <Jss innerRef={ref} theme={theme} {...props} jssContext={context} />}
            </ThemeConsumer>
          )
        }

        return <Jss innerRef={ref} {...props} jssContext={context} />
      }}
    </JssContext.Consumer>
  ))

  JssContextSubscriber.displayName = 'JssContextSubscriber'

  return JssContextSubscriber
}
