/* @flow */

import Jss from './Jss'
import StyleSheet from './StyleSheet'
import ConditionalRule from './plugins/ConditionalRule'

export {
  StyleSheet,
  Jss
}

export type Plugin = {
  onCreateRule?: Function,
  onProcessRule?: Function
}

export type PublicJssOptions = {
  generateClassName?: Function,
  plugins?: Array<Plugin>
}

export type JssOptions = {
  generateClassName: Function,
  plugins: Array<Plugin>
}

/**
 * - `media` media query - attribute of style element.
 * - `meta` meta information about this style - attribute of style element,
 *   for e.g. you could pass
 * component name for easier debugging.
 * - `link` link jss `Rule` instances with DOM `CSSStyleRule` instances so that
 *   styles, can be modified
 * dynamically, false by default because it has some performance cost.
 * - `element` style element, will create one by default
 * - `index` 0 by default - determines DOM rendering order, higher number = higher specificity
 *  (inserted after)
 * - `virtual` if true, use VirtualRenderer
 */
export type PublicStyleSheetOptions = {
  media?: string,
  meta?: string,
  link?: boolean,
  element?: HTMLStyleElement,
  index?: number,
  virtual?: boolean
}

export type StyleSheetOptions = {
  jss: Jss,
  generateClassName: Function
}

export type InstanceStyleSheetOptions = {
  index: number,
  jss: Jss,
  generateClassName: Function,
  sheet: StyleSheet,
  parent: StyleSheet,
  classes: Object,
  Renderer: Function,
  element?: HTMLStyleElement,
  meta?: string,
  media?: string
}

export type RuleOptions = {
  Renderer?: Function,
  generateClassName?: Function,
  index?: number
}

export type RulesContainerOptions = {
  classes: Object,
  generateClassName: Function,
  Renderer: Function,
  jss: Jss,
  sheet: StyleSheet,
  parent: ConditionalRule | StyleSheet
}

export type toCssOptions = {
  indentationLevel?: number,
  selector?: boolean
}

export type Rule = {
  name?: string,
  selector?: string,
  renderable?: CSSStyleRule,
  toString: Function
}
