// @flow
import React, {Component, type ComponentType} from 'react'
import PropTypes from 'prop-types'
import defaultTheming from 'theming'
import type {StyleSheet} from 'jss'
import jss, {getDynamicStyles, SheetsManager} from './jss'
import compose from './compose'
import getDisplayName from './getDisplayName'
import * as ns from './ns'
import contextTypes from './contextTypes'
import type {
  Options,
  Theme,
  StylesOrCreator,
  InnerProps,
  OuterProps,
  Context,
  SubscriptionId
} from './types'

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

type State = {
  theme: Theme,
  dynamicSheet?: StyleSheet,
  classes: {}
}

const getStyles = (stylesOrCreator: StylesOrCreator, theme: Theme) => {
  if (typeof stylesOrCreator !== 'function') {
    return stylesOrCreator
  }
  return stylesOrCreator(theme)
}

// Returns an object with array property as a key and true as a value.
const toMap = arr =>
  arr.reduce((map, prop) => {
    map[prop] = true
    return map
  }, {})

const defaultInjectProps = {
  sheet: false,
  classes: true,
  theme: true
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
  const {theming = defaultTheming, inject, jss: optionsJss, ...sheetOptions} = options
  const injectMap = inject ? toMap(inject) : defaultInjectProps
  const {themeListener} = theming
  const displayName = getDisplayName(InnerComponent)
  const defaultClassNamePrefix = env === 'production' ? '' : `${displayName}-`
  const noTheme = {}
  const managerId = managersCounter++
  const manager = new SheetsManager()
  // $FlowFixMe defaultProps are not defined in React$Component
  const defaultProps: InnerPropsType = {...InnerComponent.defaultProps}
  delete defaultProps.classes

  class Jss extends Component<OuterPropsType, State> {
    static displayName = `Jss(${displayName})`
    static InnerComponent = InnerComponent
    static contextTypes = {
      ...contextTypes,
      ...(isThemingEnabled ? themeListener.contextTypes : {})
    }
    static propTypes = {
      innerRef: PropTypes.func
    }
    static defaultProps = defaultProps

    constructor(props: OuterPropsType, context: Context) {
      super(props, context)
      const theme = isThemingEnabled ? themeListener.initial(context) : noTheme

      this.state = this.createState({theme, classes: {}}, props)
    }

    componentWillMount() {
      this.manage(this.state)
    }

    componentDidMount() {
      if (isThemingEnabled) {
        this.unsubscribeId = themeListener.subscribe(this.context, this.setTheme)
      }
    }

    componentWillReceiveProps(nextProps: OuterPropsType, nextContext: Context) {
      this.context = nextContext
      const {dynamicSheet} = this.state
      if (dynamicSheet) dynamicSheet.update(nextProps)
    }

    componentWillUpdate(nextProps: OuterPropsType, nextState: State) {
      if (isThemingEnabled && this.state.theme !== nextState.theme) {
        const newState = this.createState(nextState, nextProps)
        this.manage(newState)
        this.manager.unmanage(this.state.theme)
        this.setState(newState)
      }
    }

    componentDidUpdate(prevProps: OuterPropsType, prevState: State) {
      // We remove previous dynamicSheet only after new one was created to avoid FOUC.
      if (prevState.dynamicSheet !== this.state.dynamicSheet && prevState.dynamicSheet) {
        this.jss.removeStyleSheet(prevState.dynamicSheet)
      }
    }

    componentWillUnmount() {
      if (isThemingEnabled && this.unsubscribeId) {
        themeListener.unsubscribe(this.context, this.unsubscribeId)
      }

      this.manager.unmanage(this.state.theme)
      if (this.state.dynamicSheet) {
        this.jss.removeStyleSheet(this.state.dynamicSheet)
      }
    }

    setTheme = (theme: Theme) => this.setState({theme})
    unsubscribeId: SubscriptionId
    context: Context

    createState({theme, dynamicSheet}: State, {classes: userClasses}): State {
      const contextSheetOptions = this.context[ns.sheetOptions]
      if (contextSheetOptions && contextSheetOptions.disableStylesGeneration) {
        return {theme, dynamicSheet, classes: {}}
      }

      let classNamePrefix = defaultClassNamePrefix
      let staticSheet = this.manager.get(theme)

      if (contextSheetOptions && contextSheetOptions.classNamePrefix) {
        classNamePrefix = contextSheetOptions.classNamePrefix + classNamePrefix
      }

      if (!staticSheet) {
        const styles = getStyles(stylesOrCreator, theme)
        staticSheet = this.jss.createStyleSheet(styles, {
          ...sheetOptions,
          ...contextSheetOptions,
          meta: `${displayName}, ${isThemingEnabled ? 'Themed' : 'Unthemed'}, Static`,
          classNamePrefix
        })
        this.manager.add(theme, staticSheet)
        // $FlowFixMe Cannot add random fields to instance of class StyleSheet
        staticSheet[dynamicStylesNs] = getDynamicStyles(styles)
      }

      // $FlowFixMe Cannot access random fields on instance of class StyleSheet
      const dynamicStyles = staticSheet[dynamicStylesNs]

      if (dynamicStyles) {
        dynamicSheet = this.jss.createStyleSheet(dynamicStyles, {
          ...sheetOptions,
          ...contextSheetOptions,
          meta: `${displayName}, ${isThemingEnabled ? 'Themed' : 'Unthemed'}, Dynamic`,
          classNamePrefix,
          link: true
        })
      }

      // $FlowFixMe InnerComponent can be class or stateless, the latter doesn't have a defaultProps property
      const defaultClasses = InnerComponent.defaultProps
        ? InnerComponent.defaultProps.classes
        : undefined
      const jssClasses = dynamicSheet
        ? compose(
            staticSheet.classes,
            dynamicSheet.classes
          )
        : staticSheet.classes
      const classes = {
        ...defaultClasses,
        ...jssClasses,
        ...userClasses
      }

      return {theme, dynamicSheet, classes}
    }

    manage({theme, dynamicSheet}: State) {
      const contextSheetOptions = this.context[ns.sheetOptions]
      if (contextSheetOptions && contextSheetOptions.disableStylesGeneration) {
        return
      }
      const registry = this.context[ns.sheetsRegistry]

      const staticSheet = this.manager.manage(theme)
      if (registry) registry.add(staticSheet)

      if (dynamicSheet) {
        dynamicSheet.update(this.props).attach()
        if (registry) registry.add(dynamicSheet)
      }
    }

    get jss() {
      return this.context[ns.jss] || optionsJss || jss
    }

    get manager() {
      const managers = this.context[ns.managers]

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

    render() {
      const {theme, dynamicSheet, classes} = this.state
      const {innerRef, ...props}: OuterPropsType = this.props
      const sheet = dynamicSheet || this.manager.get(theme)

      if (injectMap.sheet && !props.sheet) props.sheet = sheet
      if (isThemingEnabled && injectMap.theme && !props.theme) props.theme = theme

      // We have merged classes already.
      if (injectMap.classes) props.classes = classes

      return <InnerComponent ref={innerRef} {...props} />
    }
  }

  return Jss
}
