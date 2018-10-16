// @flow

const hasCSSTOMSupport = window.CSS && window.CSS.number
const getDefaultUnit = (cssomFN, fallback) => (hasCSSTOMSupport ? cssomFN : fallback)

/**
 * Generated jss-plugin-syntax-default-unit CSS property units
 *
 * @type object
 */
export default {
  // Animation properties
  'animation-delay': getDefaultUnit(window.CSS.ms, 'ms'),
  'animation-duration': getDefaultUnit(window.CSS.ms, 'ms'),

  // Background properties
  'background-position': getDefaultUnit(window.CSS.px, 'px'),
  'background-position-x': getDefaultUnit(window.CSS.px, 'px'),
  'background-position-y': getDefaultUnit(window.CSS.px, 'px'),
  'background-size': getDefaultUnit(window.CSS.px, 'px'),

  // Border Properties
  border: getDefaultUnit(window.CSS.px, 'px'),
  'border-bottom': getDefaultUnit(window.CSS.px, 'px'),
  'border-bottom-left-radius': getDefaultUnit(window.CSS.px, 'px'),
  'border-bottom-right-radius': getDefaultUnit(window.CSS.px, 'px'),
  'border-bottom-width': getDefaultUnit(window.CSS.px, 'px'),
  'border-left': getDefaultUnit(window.CSS.px, 'px'),
  'border-left-width': getDefaultUnit(window.CSS.px, 'px'),
  'border-radius': getDefaultUnit(window.CSS.px, 'px'),
  'border-right': getDefaultUnit(window.CSS.px, 'px'),
  'border-right-width': getDefaultUnit(window.CSS.px, 'px'),
  'border-spacing': getDefaultUnit(window.CSS.px, 'px'),
  'border-top': getDefaultUnit(window.CSS.px, 'px'),
  'border-top-left-radius': getDefaultUnit(window.CSS.px, 'px'),
  'border-top-right-radius': getDefaultUnit(window.CSS.px, 'px'),
  'border-top-width': getDefaultUnit(window.CSS.px, 'px'),
  'border-width': getDefaultUnit(window.CSS.px, 'px'),
  'border-after-width': getDefaultUnit(window.CSS.px, 'px'),
  'border-before-width': getDefaultUnit(window.CSS.px, 'px'),
  'border-end-width': getDefaultUnit(window.CSS.px, 'px'),
  'border-horizontal-spacing': getDefaultUnit(window.CSS.px, 'px'),
  'border-start-width': getDefaultUnit(window.CSS.px, 'px'),
  'border-vertical-spacing': getDefaultUnit(window.CSS.px, 'px'),

  // Margin properties
  margin: getDefaultUnit(window.CSS.px, 'px'),
  'margin-after': getDefaultUnit(window.CSS.px, 'px'),
  'margin-before': getDefaultUnit(window.CSS.px, 'px'),
  'margin-bottom': getDefaultUnit(window.CSS.px, 'px'),
  'margin-left': getDefaultUnit(window.CSS.px, 'px'),
  'margin-right': getDefaultUnit(window.CSS.px, 'px'),
  'margin-top': getDefaultUnit(window.CSS.px, 'px'),
  'margin-end': getDefaultUnit(window.CSS.px, 'px'),
  'margin-start': getDefaultUnit(window.CSS.px, 'px'),

  // Padding properties
  padding: getDefaultUnit(window.CSS.px, 'px'),
  'padding-bottom': getDefaultUnit(window.CSS.px, 'px'),
  'padding-left': getDefaultUnit(window.CSS.px, 'px'),
  'padding-right': getDefaultUnit(window.CSS.px, 'px'),
  'padding-top': getDefaultUnit(window.CSS.px, 'px'),
  'padding-after': getDefaultUnit(window.CSS.px, 'px'),
  'padding-before': getDefaultUnit(window.CSS.px, 'px'),
  'padding-end': getDefaultUnit(window.CSS.px, 'px'),
  'padding-start': getDefaultUnit(window.CSS.px, 'px'),

  // Mask properties
  'mask-position-x': getDefaultUnit(window.CSS.px, 'px'),
  'mask-position-y': getDefaultUnit(window.CSS.px, 'px'),
  'mask-size': getDefaultUnit(window.CSS.px, 'px'),

  // Width and height properties
  'min-logical-height': getDefaultUnit(window.CSS.px, 'px'),
  'max-logical-height': getDefaultUnit(window.CSS.px, 'px'),
  'min-logical-width': getDefaultUnit(window.CSS.px, 'px'),
  'max-logical-width': getDefaultUnit(window.CSS.px, 'px'),
  'min-height': getDefaultUnit(window.CSS.px, 'px'),
  'max-height': getDefaultUnit(window.CSS.px, 'px'),
  'min-width': getDefaultUnit(window.CSS.px, 'px'),
  'max-width': getDefaultUnit(window.CSS.px, 'px'),
  height: getDefaultUnit(window.CSS.px, 'px'),
  width: getDefaultUnit(window.CSS.px, 'px'),
  'logical-height': getDefaultUnit(window.CSS.px, 'px'),
  'logical-width': getDefaultUnit(window.CSS.px, 'px'),

  // Position properties
  bottom: getDefaultUnit(window.CSS.px, 'px'),
  left: getDefaultUnit(window.CSS.px, 'px'),
  top: getDefaultUnit(window.CSS.px, 'px'),
  right: getDefaultUnit(window.CSS.px, 'px'),

  // Shadow properties
  'box-shadow': getDefaultUnit(window.CSS.px, 'px'),
  'text-shadow': getDefaultUnit(window.CSS.px, 'px'),

  // Column properties
  'column-gap': getDefaultUnit(window.CSS.px, 'px'),
  'column-rule': getDefaultUnit(window.CSS.px, 'px'),
  'column-rule-width': getDefaultUnit(window.CSS.px, 'px'),
  'column-width': getDefaultUnit(window.CSS.px, 'px'),

  // Font and text properties
  'font-size': getDefaultUnit(window.CSS.px, 'px'),
  'font-size-delta': getDefaultUnit(window.CSS.px, 'px'),
  'letter-spacing': getDefaultUnit(window.CSS.px, 'px'),
  'text-indent': getDefaultUnit(window.CSS.px, 'px'),
  'text-stroke': getDefaultUnit(window.CSS.px, 'px'),
  'text-stroke-width': getDefaultUnit(window.CSS.px, 'px'),
  'word-spacing': getDefaultUnit(window.CSS.px, 'px'),

  // Motion properties
  motion: getDefaultUnit(window.CSS.px, 'px'),
  'motion-offset': getDefaultUnit(window.CSS.px, 'px'),

  // Outline properties
  outline: getDefaultUnit(window.CSS.px, 'px'),
  'outline-offset': getDefaultUnit(window.CSS.px, 'px'),
  'outline-width': getDefaultUnit(window.CSS.px, 'px'),

  // Perspective properties
  perspective: getDefaultUnit(window.CSS.px, 'px'),
  'perspective-origin-x': getDefaultUnit(window.CSS.percent, '%'),
  'perspective-origin-y': getDefaultUnit(window.CSS.percent, '%'),

  // Transform properties
  'transform-origin': getDefaultUnit(window.CSS.percent, '%'),
  'transform-origin-x': getDefaultUnit(window.CSS.percent, '%'),
  'transform-origin-y': getDefaultUnit(window.CSS.percent, '%'),
  'transform-origin-z': getDefaultUnit(window.CSS.percent, '%'),

  // Transition properties
  'transition-delay': getDefaultUnit(window.CSS.ms, 'ms'),
  'transition-duration': getDefaultUnit(window.CSS.ms, 'ms'),

  // Alignment properties
  'vertical-align': getDefaultUnit(window.CSS.px, 'px'),
  'flex-basis': getDefaultUnit(window.CSS.px, 'px'),

  // Some random properties
  'shape-margin': getDefaultUnit(window.CSS.px, 'px'),
  size: getDefaultUnit(window.CSS.px, 'px'),

  // Grid properties
  grid: getDefaultUnit(window.CSS.px, 'px'),
  'grid-gap': getDefaultUnit(window.CSS.px, 'px'),
  'grid-row-gap': getDefaultUnit(window.CSS.px, 'px'),
  'grid-column-gap': getDefaultUnit(window.CSS.px, 'px'),
  'grid-template-rows': getDefaultUnit(window.CSS.px, 'px'),
  'grid-template-columns': getDefaultUnit(window.CSS.px, 'px'),
  'grid-auto-rows': getDefaultUnit(window.CSS.px, 'px'),
  'grid-auto-columns': getDefaultUnit(window.CSS.px, 'px'),

  // Not existing properties.
  // Used to avoid issues with jss-expand integration.
  'box-shadow-x': getDefaultUnit(window.CSS.px, 'px'),
  'box-shadow-y': getDefaultUnit(window.CSS.px, 'px'),
  'box-shadow-blur': getDefaultUnit(window.CSS.px, 'px'),
  'box-shadow-spread': getDefaultUnit(window.CSS.px, 'px'),
  'font-line-height': getDefaultUnit(window.CSS.px, 'px'),
  'text-shadow-x': getDefaultUnit(window.CSS.px, 'px'),
  'text-shadow-y': getDefaultUnit(window.CSS.px, 'px'),
  'text-shadow-blur': getDefaultUnit(window.CSS.px, 'px')
}
