/* @flow */

import Jss from './Jss'
import StyleSheet from './StyleSheet'
import ConditionalRule from './plugins/ConditionalRule'

export type Plugin = {
  onCreateRule?: Function,
  onProcessRule?: Function
}

export type JssOptions = {
  generateClassName?: Function,
  plugins?: Array<Plugin>
}

export type StyleSheetOptions = {}

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
  selector?: Boolean
}

export type Rule = {
  name?: string,
  selector?: string
}
