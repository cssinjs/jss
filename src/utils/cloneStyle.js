import type {JssStyle} from '../types'

export default (style: JssStyle): JssStyle => {
  const newStyle = {}
  for (const name in style) {
    const value = style[name]
    if (typeof value === 'function') continue
    newStyle[name] = value
  }
  return newStyle
}
