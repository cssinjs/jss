import type {JssStyle} from '../types'

const plainObjectConstrurctor = {}.constructor

export default function cloneStyle(style: JssStyle): JssStyle {
  if (typeof style === 'object' && style != null) {
    if (Array.isArray(style)) return style.map(cloneStyle)

    if (style.constructor !== plainObjectConstrurctor) return style

    const newStyle = {}
    for (const name in style) {
      const value = style[name]
      newStyle[name] = typeof value === 'object' ? cloneStyle(value) : value
    }

    return newStyle
  }

  return style
}
