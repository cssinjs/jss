// @flow

import {hasCSSTOMSupport} from 'jss'

const px = hasCSSTOMSupport && CSS ? CSS.px : 'px'
const ms = hasCSSTOMSupport && CSS ? CSS.ms : 'ms'
const percent = hasCSSTOMSupport && CSS ? CSS.percent : '%'

/**
 * Generated jss-plugin-default-unit CSS property units
 *
 * @type object
 */
export default {
  // Animation properties
  'animation-delay': ms,
  'animation-duration': ms,

  // Background properties
  'background-position': px,
  'background-position-x': px,
  'background-position-y': px,
  'background-size': px,

  // Border Properties
  border: px,
  'border-bottom': px,
  'border-bottom-left-radius': px,
  'border-bottom-right-radius': px,
  'border-bottom-width': px,
  'border-left': px,
  'border-left-width': px,
  'border-radius': px,
  'border-right': px,
  'border-right-width': px,
  'border-top': px,
  'border-top-left-radius': px,
  'border-top-right-radius': px,
  'border-top-width': px,
  'border-width': px,

  // Margin properties
  margin: px,
  'margin-bottom': px,
  'margin-left': px,
  'margin-right': px,
  'margin-top': px,

  // Padding properties
  padding: px,
  'padding-bottom': px,
  'padding-left': px,
  'padding-right': px,
  'padding-top': px,

  // Mask properties
  'mask-position-x': px,
  'mask-position-y': px,
  'mask-size': px,

  // Width and height properties
  height: px,
  width: px,
  'min-height': px,
  'max-height': px,
  'min-width': px,
  'max-width': px,

  // Position properties
  bottom: px,
  left: px,
  top: px,
  right: px,

  // Shadow properties
  'box-shadow': px,
  'text-shadow': px,

  // Column properties
  'column-gap': px,
  'column-rule': px,
  'column-rule-width': px,
  'column-width': px,

  // Font and text properties
  'font-size': px,
  'font-size-delta': px,
  'letter-spacing': px,
  'text-indent': px,
  'text-stroke': px,
  'text-stroke-width': px,
  'word-spacing': px,

  // Motion properties
  motion: px,
  'motion-offset': px,

  // Outline properties
  outline: px,
  'outline-offset': px,
  'outline-width': px,

  // Perspective properties
  perspective: px,
  'perspective-origin-x': percent,
  'perspective-origin-y': percent,

  // Transform properties
  'transform-origin': percent,
  'transform-origin-x': percent,
  'transform-origin-y': percent,
  'transform-origin-z': percent,

  // Transition properties
  'transition-delay': ms,
  'transition-duration': ms,

  // Alignment properties
  'vertical-align': px,
  'flex-basis': px,

  // Some random properties
  'shape-margin': px,
  size: px,

  // Grid properties
  grid: px,
  'grid-gap': px,
  'grid-row-gap': px,
  'grid-column-gap': px,
  'grid-template-rows': px,
  'grid-template-columns': px,
  'grid-auto-rows': px,
  'grid-auto-columns': px,

  // Not existing properties.
  // Used to avoid issues with jss-plugin-expand integration.
  'box-shadow-x': px,
  'box-shadow-y': px,
  'box-shadow-blur': px,
  'box-shadow-spread': px,
  'font-line-height': px,
  'text-shadow-x': px,
  'text-shadow-y': px,
  'text-shadow-blur': px
}
