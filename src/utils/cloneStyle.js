import type {JssStyle} from '../types'

export default (decl: JssStyle): JssStyle => {
  // Support empty values in case user ends up with them by accident.
  // Support string value for SimpleRule.
  if (!decl || typeof decl === 'string') return decl

  // Support array for FontFaceRule.
  if (Array.isArray(decl)) return decl.slice(0)

  const newStyle = {}
  for (const name in decl) {
    const value = decl[name]
    if (typeof value === 'function') continue
    newStyle[name] = value
  }
  return newStyle
}
