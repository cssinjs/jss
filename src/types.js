/* @flow */
import Jss from './Jss'
import StyleSheet from './StyleSheet'
import ConditionalRule from './plugins/ConditionalRule'

export {StyleSheet, Jss}

export type InstanceStyleSheetOptions = {
  index: number,
  jss: Jss,
  generateClassName: Function,
  sheet: StyleSheet,
  parent: ConditionalRule|StyleSheet,
  classes: Object,
  Renderer: Renderer,
  element?: HTMLStyleElement,
  meta?: string,
  media?: string
}

export type RulesContainerOptions = {
  classes: Object,
  generateClassName: Function,
  Renderer: Renderer,
  jss: Jss,
  sheet: StyleSheet,
  parent: ConditionalRule|StyleSheet
}

/**
 * - `selector` use `false` to get a rule without selector
 * - `indentationLevel` level of indentation
 */
export type ToCssOptions = {
  indentationLevel?: number,
  selector?: boolean
}

export type Rule = {
  name?: string,
  selector?: string,
  renderable?: CSSStyleRule,
  toString: Function
}

export type InstanceRuleOptions = {
  className?: string,
  selector?: string,
  generateClassName: Function,
  jss: any,
  renderer: Renderer,
  sheet?: any,
  Renderer: Renderer
}

