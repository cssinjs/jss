import pluginStyleRule, {StyleRule} from './styleRule'
import pluginConditionalRule, {ConditionalRule} from './conditionalRule'
import pluginKeyframesRule, {KeyframesRule} from './keyframesRule'
import pluginKeyframeRule, {KeyframeRule} from './keyframeRule'
import pluginLayerRule, {LayerRule} from './layerRule'
import pluginFontFaceRule, {FontFaceRule} from './fontFaceRule'
import pluginViewportRule, {ViewportRule} from './viewportRule'
import pluginSimpleRule, {SimpleRule} from './simpleRule'

export const plugins = [
  pluginStyleRule,
  pluginConditionalRule,
  pluginKeyframesRule,
  pluginKeyframeRule,
  pluginLayerRule,
  pluginFontFaceRule,
  pluginViewportRule,
  pluginSimpleRule
]

export {
  StyleRule,
  ConditionalRule,
  KeyframesRule,
  KeyframeRule,
  LayerRule,
  FontFaceRule,
  ViewportRule,
  SimpleRule
}
