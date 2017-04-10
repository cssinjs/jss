import type {JssStyle} from '../types'

const {isArray} = Array

export default function cloneStyle(style: JssStyle): JssStyle {
  // Support empty values in case user ends up with them by accident.
  if (style == null) return style

  // Support string value for SimpleRule.
  const typeOfStyle = typeof style
  if (typeOfStyle === 'string' || typeOfStyle === 'number') return style

  // Support array for FontFaceRule.
  if (isArray(style)) return style.map(cloneStyle)

  const newStyle = {}
  for (const name in style) {
    const value = style[name]
    if (typeof value === 'object') {
      newStyle[name] = cloneStyle(value)
      continue
    }
    newStyle[name] = value
  }

  return newStyle
}
