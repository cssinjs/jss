import React, {Component} from 'react'
import PropTypes from 'prop-types'
import defaultTheming from 'theming'
import jss, {getDynamicStyles, SheetsManager} from './jss'
import compose from './compose'
import getDisplayName from './getDisplayName'
import * as ns from './ns'
import contextTypes from './contextTypes'

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

const getStyles = (stylesOrCreator, theme) => {
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

/**
 * Wrap a Component into a JSS Container Component.
 *
 * @param {Object|Function} stylesOrCreator
 * @param {Component} InnerComponent
 * @param {Object} [options]
 * @return {Component}
 */
export default (stylesOrCreator, InnerComponent, options = {}) => {
  const isThemingEnabled = typeof stylesOrCreator === 'function'
  const {theming = defaultTheming, inject, jss: optionsJss, ...sheetOptions} = options
  const injectMap = inject ? toMap(inject) : defaultInjectProps
  const {themeListener} = theming
  const displayName = getDisplayName(InnerComponent)
  const defaultClassNamePrefix = env === 'production' ? undefined : `${displayName}-`
  const noTheme = {}
  const managerId = managersCounter++
  const manager = new SheetsManager()
  const defaultProps = {...InnerComponent.defaultProps}
  delete defaultProps.classes

  class Jss extends Component {
    static displayName = `Jss(${displayName})`
    static InnerComponent = InnerComponent
    static contextTypes = {
      ...contextTypes,
      ...(isThemingEnabled && themeListener.contextTypes)
    }
    static propTypes = {
      innerRef: PropTypes.func
    }
    static defaultProps = defaultProps

    constructor(props, context) {
      super(props, context)
      const theme = isThemingEnabled ? themeListener.initial(context) : noTheme

      this.state = this.createState({theme}, props)
    }

    componentWillMount() {
      this.manage(this.state)
    }

    componentDidMount() {
      if (isThemingEnabled) {
        this.unsubscribeId = themeListener.subscribe(this.context, this.setTheme)
      }
    }

    componentWillReceiveProps(nextProps, nextContext) {
      this.context = nextContext
      const {dynamicSheet} = this.state
      if (dynamicSheet) dynamicSheet.update(nextProps)
    }

    componentWillUpdate(nextProps, nextState) {
      if (isThemingEnabled && this.state.theme !== nextState.theme) {
        const newState = this.createState(nextState, nextProps)
        this.manage(newState)
        this.manager.unmanage(this.state.theme)
        this.setState(newState)
      }
    }

    componentDidUpdate(prevProps, prevState) {
      // We remove previous dynamicSheet only after new one was created to avoid FOUC.
      if (prevState.dynamicSheet !== this.state.dynamicSheet && prevState.dynamicSheet) {
        this.jss.removeStyleSheet(prevState.dynamicSheet)
      }
    }

    componentWillUnmount() {
      if (this.unsubscribeId) {
        themeListener.unsubscribe(this.context, this.unsubscribeId)
      }

      this.manager.unmanage(this.state.theme)
      if (this.state.dynamicSheet) {
        this.state.dynamicSheet.detach()
      }
    }

    setTheme = theme => this.setState({theme})

    createState({theme, dynamicSheet}, {classes: userClasses}) {
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
        staticSheet[dynamicStylesNs] = getDynamicStyles(styles)
      }

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

    manage({theme, dynamicSheet}) {
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
      const {innerRef, ...props} = this.props

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
