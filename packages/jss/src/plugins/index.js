import {StyleRule, plugin as pluginStyleRule} from './styleRule'
import {ConditionalRule, plugin as pluginConditionalRule} from './conditionalRule'
import {KeyframesRule, plugin as pluginKeyframesRule} from './keyframesRule'
import {FontFaceRule, plugin as pluginFontFaceRule} from './fontFaceRule'
import {ViewportRule, plugin as pluginViewportRule} from './viewportRule'
import {SimpleRule, plugin as pluginSimpleRule} from './simpleRule'

export const plugins = [
  pluginStyleRule,
  pluginConditionalRule,
  pluginKeyframesRule,
  pluginFontFaceRule,
  pluginViewportRule,
  pluginSimpleRule
]

export {StyleRule, ConditionalRule, KeyframesRule, FontFaceRule, ViewportRule, SimpleRule}
