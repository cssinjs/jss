// @flow
/* eslint-disable react/prop-types, react/require-default-props */

import * as React from 'react'
import isPropValid from '@emotion/is-prop-valid'
import type {StatelessFunctionalComponent, ComponentType} from 'react'
import {ThemeContext as DefaultThemeContext} from 'theming'

import createUseStyles from './createUseStyles'
import type {HookOptions, StaticStyle, DynamicStyle, Styles} from './types'

type StyledProps = {
  className?: string,
  as?: string
}

type StyleArg<Theme> = StaticStyle | DynamicStyle<Theme> | null | void | ''

type ShouldForwardProp = string => boolean

type ParseStyles = <Theme>({[string]: StyleArg<Theme>}) => {|styles: Styles<Theme>, label: string|}

// eslint-disable-next-line no-unused-vars
const parseStyles: ParseStyles = <Theme>(args) => {
  const dynamicStyles = []
  let staticStyle
  const labels = []

  // Not using ...rest to optimize perf.
  for (const key in args) {
    const style = args[key]
    if (!style) continue
    if (typeof style === 'function') {
      dynamicStyles.push(style)
    } else {
      if (!staticStyle) staticStyle = {}
      Object.assign(staticStyle, style)
      if (staticStyle.label) {
        if (labels.indexOf(staticStyle.label) === -1) labels.push(staticStyle.label)
      }
    }
  }

  const styles = {}
  const label: string = labels.length === 0 ? 'sc' : labels.join('-')

  if (staticStyle) {
    // Label should not leak to the core.
    if ('label' in staticStyle) delete staticStyle.label
    styles[label] = staticStyle
  }

  // When there is only one function rule, we don't need to wrap it.
  if (dynamicStyles.length === 1) {
    styles[('scd': string)] = dynamicStyles[0]
  }

  // We create a new function rule which will call all other function rules
  // and merge the styles they return.
  if (dynamicStyles.length > 1) {
    styles[('scd': string)] = props => {
      const merged = {}
      for (let i = 0; i < dynamicStyles.length; i++) {
        const dynamicStyle = dynamicStyles[i](props)
        if (dynamicStyle) Object.assign(merged, dynamicStyle)
      }
      return merged
    }
  }

  return {styles, label}
}

const shouldForwardPropSymbol = Symbol('react-jss-styled')

const getShouldForwardProp = (tagOrComponent, options): ShouldForwardProp => {
  const {shouldForwardProp} = options
  // $FlowFixMe[invalid-computed-prop]
  // $FlowFixMe[incompatible-type]
  const childShouldForwardProp: ShouldForwardProp = tagOrComponent[shouldForwardPropSymbol]
  let finalShouldForwardProp = shouldForwardProp || childShouldForwardProp
  if (shouldForwardProp && childShouldForwardProp) {
    finalShouldForwardProp = prop => childShouldForwardProp(prop) && shouldForwardProp(prop)
  }
  return finalShouldForwardProp
}

const getChildProps = (props, shouldForwardProp, isTag) => {
  const childProps: StyledProps = ({}: any)

  for (const prop in props) {
    if (shouldForwardProp) {
      if (shouldForwardProp(prop) === true) {
        childProps[prop] = props[prop]
      }
      continue
    }

    // We don't want to pass non-dom props to the DOM.
    if (isTag) {
      if (isPropValid(prop)) {
        childProps[prop] = props[prop]
      }
      continue
    }

    childProps[prop] = props[prop]
  }

  return childProps
}

type StyledOptions<Theme> = {|
  ...HookOptions<Theme>,
  shouldForwardProp?: ShouldForwardProp
|}

type CreateStyledComponent<Theme> = (
  ...StyleArg<Theme>[]
) => StatelessFunctionalComponent<StyledProps>

type ConfigureStyled = <Theme: {}>(
  string | StatelessFunctionalComponent<StyledProps> | ComponentType<StyledProps>,
  StyledOptions<Theme> | void
) => CreateStyledComponent<Theme>

// eslint-disable-next-line no-unused-vars
const configureStyled: ConfigureStyled = <Theme: {}>(tagOrComponent, options = {}) => {
  const {theming} = options
  const isTag = typeof tagOrComponent === 'string'

  const ThemeContext = theming ? theming.context : DefaultThemeContext
  const shouldForwardProp = getShouldForwardProp(tagOrComponent, options)
  const {shouldForwardProp: _, ...hookOptions} = options

  return function createStyledComponent() {
    // eslint-disable-next-line prefer-rest-params
    const {styles, label} = parseStyles(arguments)
    const useStyles = createUseStyles(styles, hookOptions)

    const Styled = (props: StyledProps) => {
      const {as, className} = props
      const theme = React.useContext(ThemeContext)
      const propsWithTheme: StyledProps = Object.assign(({theme}: any), props)
      const classes = useStyles(propsWithTheme)
      const childProps = getChildProps(props, shouldForwardProp, isTag)

      const classNames = `${classes[label] || classes.sc || ''} ${classes.scd || ''}`.trim()
      childProps.className = className ? `${className} ${classNames}` : classNames

      if (!isTag && shouldForwardProp) {
        // $FlowFixMe[invalid-computed-prop] we are not supposed to attach random properties to component functions.
        // $FlowFixMe[incompatible-use]
        tagOrComponent[shouldForwardPropSymbol] = shouldForwardProp
      }

      if (isTag && as) {
        return React.createElement(as, childProps)
      }

      return React.createElement(tagOrComponent, childProps)
    }

    return Styled
  }
}

export default configureStyled
