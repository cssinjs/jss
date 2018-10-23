import $$observable from 'symbol-observable'
import type {JssStyle} from '../types'

const {isArray} = Array

// TODO: This should propably not be here, need to find a better place
const isObservable = value => value && value[$$observable] && value === value[$$observable]()

export default function cloneStyle(style: JssStyle): JssStyle {
  // Support empty values in case user ends up with them by accident.
  if (style == null) return style

  // Support string value for SimpleRule.
  const typeOfStyle = typeof style

  if (typeOfStyle === 'string' || typeOfStyle === 'number' || typeOfStyle === 'function') {
    return style
  }

  // It is a CSSTOM value.
  // TODO will not work if instance comes from a different window.
  if (global.CSSStyleValue && style instanceof global.CSSStyleValue) {
    return style
  }

  // Support array for FontFaceRule.
  if (isArray(style)) return style.map(cloneStyle)

  // Support Observable styles.  Observables are immutable, so we don't need to
  // copy them.
  if (isObservable(style)) return style

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
