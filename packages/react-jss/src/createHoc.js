// @flow
/* eslint-disable react/destructuring-assignment */
import React, {Component, type ComponentType} from 'react'
import PropTypes from 'prop-types'
import {withTheme} from 'theming'
import type {StyleSheet} from 'jss'
import jss, {getDynamicStyles, SheetsManager} from './jss'
import compose from './compose'
import getDisplayName from './getDisplayName'
import * as ns from './ns'
import contextTypes from './contextTypes'
import type {Options, Theme, StylesOrCreator, InnerProps, OuterProps, Context} from './types'

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
  dynamicSheet: StyleSheet | null,
  staticSheet: StyleSheet | null,
  classes: {}
|}

const getStyles = (stylesOrCreator: StylesOrCreator, theme: Theme) => {
  if (typeof stylesOrCreator !== 'function') {
    return stylesOrCreator
  }
  return stylesOrCreator(theme)
}

// Returns an object with array property as a key and true as a value.
const toMap = arr =>
  arr.reduce(
    (map, prop) => ({
      ...map,
      [prop]: true
    }),
    {}
  )

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
  const {theming, inject, jss: optionsJss, ...sheetOptions} = options
  const injectMap = inject ? toMap(inject) : defaultInjectProps
  const displayName = getDisplayName(InnerComponent)
  const defaultClassNamePrefix = env === 'production' ? '' : `${displayName}-`
  const noTheme = {}
  const managerId = managersCounter++
  const manager = new SheetsManager()

  // $FlowFixMe: DefaultProps is missing in type definitions
  const {classes: defaultClasses = {}, ...defaultProps} = {...InnerComponent.defaultProps}

  class Jss extends Component<OuterPropsType, State> {
    static displayName = `Jss(${displayName})`

    static InnerComponent = InnerComponent

    static contextTypes = contextTypes

    static propTypes = {
      innerRef: PropTypes.func
    }

    static defaultProps = {
      ...defaultProps,
      theme: noTheme
    }

    classNamePrefix: string = defaultClassNamePrefix

    constructor(props: OuterPropsType, context: Context) {
      super(props, context)

      const contextSheetOptions = context[ns.sheetOptions]

      if (contextSheetOptions && contextSheetOptions.classNamePrefix) {
        this.classNamePrefix = contextSheetOptions.classNamePrefix + this.classNamePrefix
      }

      this.state = this.createState()
      this.manage(this.state)
    }

    componentDidUpdate(prevProps: OuterPropsType, prevState: State) {
      const {dynamicSheet} = this.state
      if (dynamicSheet) dynamicSheet.update(this.props)

      if (isThemingEnabled && this.props.theme !== prevProps.theme) {
        const newState = this.createState()
        this.manage(newState)
        this.manager.unmanage(prevProps.theme)
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState(newState)
      }

      // We remove previous dynamicSheet only after new one was created to avoid FOUC.
      if (prevState.dynamicSheet !== this.state.dynamicSheet && prevState.dynamicSheet) {
        this.jss.removeStyleSheet(prevState.dynamicSheet)
      }
    }

    componentWillUnmount() {
      this.manager.unmanage(this.theme)
      if (this.state.dynamicSheet) {
        this.jss.removeStyleSheet(this.state.dynamicSheet)
      }
    }

    get theme() {
      return isThemingEnabled ? this.props.theme : noTheme
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

    getStaticSheet() {
      const theme = this.theme
      let staticSheet = this.manager.get(theme)

      if (staticSheet) {
        return staticSheet
      }

      const contextSheetOptions = this.context[ns.sheetOptions]
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

    getDynamicSheet(staticSheet) {
      // $FlowFixMe Cannot access random fields on instance of class StyleSheet
      const dynamicStyles = staticSheet[dynamicStylesNs]

      if (dynamicStyles) {
        const contextSheetOptions = this.context[ns.sheetOptions]

        return this.jss.createStyleSheet(dynamicStyles, {
          ...sheetOptions,
          ...contextSheetOptions,
          meta: `${displayName}, ${isThemingEnabled ? 'Themed' : 'Unthemed'}, Dynamic`,
          classNamePrefix: this.classNamePrefix,
          link: true
        })
      }

      return null
    }

    manage({dynamicSheet, staticSheet}: State) {
      const registry = this.context[ns.sheetsRegistry]

      if (staticSheet && registry) registry.add(staticSheet)

      if (dynamicSheet !== null) {
        dynamicSheet.update(this.props).attach()
        if (registry) registry.add(dynamicSheet)
      }
    }

    computeClasses(staticSheet, dynamicSheet) {
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
      const contextSheetOptions = this.context[ns.sheetOptions]
      if (contextSheetOptions && contextSheetOptions.disableStylesGeneration) {
        return {
          classes: {},
          dynamicSheet: null,
          staticSheet: null
        }
      }

      const staticSheet = this.getStaticSheet()
      const dynamicSheet = this.getDynamicSheet(staticSheet)

      return {staticSheet, dynamicSheet, classes: this.computeClasses(staticSheet, dynamicSheet)}
    }

    context: Context

    render() {
      const {dynamicSheet, classes, staticSheet} = this.state
      const {innerRef, ...props}: OuterPropsType = this.props
      const sheet = dynamicSheet || staticSheet

      if (injectMap.sheet && !props.sheet && sheet) props.sheet = sheet

      // We have merged classes already.
      if (injectMap.classes) props.classes = classes

      return <InnerComponent ref={innerRef} {...props} />
    }
  }

  if (isThemingEnabled || injectMap.theme) {
    return theming ? theming.withTheme(Jss) : withTheme(Jss)
  }

  return Jss
}
