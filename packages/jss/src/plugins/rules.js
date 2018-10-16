/* @flow */
import type {Plugin, RuleOptions, Rule, JssStyle} from '../types'
import ConditionalRule from '../rules/ConditionalRule'
import {plugin as pluginViewport} from './viewport'
import {plugin as pluginKeyframes} from './keyframes'
import {plugin as pluginStyle} from './style'
import {plugin as pluginSimpleRule} from './simpleRule'
import {plugin as pluginFontFaceRule} from './fontFaceRule'

const classes = {
  '@media': ConditionalRule,
  '@supports': ConditionalRule
}

/**
 * Generate plugins which will register all rules.
 */
const plugins: Array<Plugin> = Object.keys(classes).map((key: string) => {
  // https://jsperf.com/indexof-vs-substr-vs-regex-at-the-beginning-3
  const re = new RegExp(`^${key}`)
  const RuleClass = classes[key]
  const onCreateRule = (name: string, decl: JssStyle, options: RuleOptions): Rule | null =>
    re.test(name) ? new RuleClass(name, decl, options) : null
  return {onCreateRule, queue: 1}
})

plugins.push(pluginKeyframes, pluginStyle, pluginViewport, pluginSimpleRule, pluginFontFaceRule)

export default plugins
