// @flow
/* eslint-disable react/destructuring-assignment */
import React, {Component, type ComponentType} from 'react'
import PropTypes from 'prop-types'
import {ThemeContext} from 'theming'
import {getDynamicStyles, SheetsManager, type StyleSheet, type Classes} from 'jss'
import defaultJss from './jss'
import compose from './compose'
import getDisplayName from './getDisplayName'
import JssContext from './JssContext'
import type {Options, Theme, StylesOrCreator, InnerProps, OuterProps} from './types'

const env = process.env.NODE_ENV

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
  const defaultClassNamePrefix = env === 'production' ? '' : `${displayName}-`
  const noTheme = {}
  const managerId = managersCounter++
  const manager = new SheetsManager()
  const ThemeConsumer = (theming && theming.context.Consumer) || ThemeContext.Consumer

  // $FlowFixMe: DefaultProps is missing in type definitions
  const {classes: defaultClasses = {}, ...defaultProps} = {...InnerComponent.defaultProps}

  const getTheme = props => (isThemingEnabled && props.theme ? props.theme : noTheme)

  class Jss extends Component<OuterPropsType, State> {
    static displayName = `Jss(${displayName})`

    static propTypes = {
      innerRef: PropTypes.func
    }

    static defaultProps = defaultProps

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
      return this.props.jssContext.jss || optionsJss || jss
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

    computeClasses(staticSheet: StyleSheet, dynamicSheet?: StyleSheet): Classes {
      const jssClasses = dynamicSheet
        ? compose(
            staticSheet.classes,
            dynamicSheet.classes
          )
        : staticSheet.classes
      return {
        ...defaultClasses,
        ...jssClasses,
        ...this.props.classes
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
        classes: this.computeClasses(staticSheet, dynamicSheet)
      }
    }

    render() {
      const {classes} = this.state
      const {
        innerRef,
        theme,
        jssContext,
        // $FlowFixMe: Flow complains for no reason...
        ...props
      } = this.props

      if (injectTheme && props.theme) props.theme = theme

      // We have merged classes already.
      props.classes = classes

      if (innerRef) props.ref = innerRef

      return <InnerComponent {...props} />
    }
  }

  return function JssContextSubscriber(props) {
    return (
      <JssContext.Consumer>
        {context => {
          if (isThemingEnabled || injectTheme) {
            return (
              <ThemeConsumer>
                {theme => <Jss theme={theme} {...props} jssContext={context} />}
              </ThemeConsumer>
            )
          }

          return <Jss {...props} jssContext={context} />
        }}
      </JssContext.Consumer>
    )
  }
}
