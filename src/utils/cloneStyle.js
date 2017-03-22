export default (style) => {
  const newStyle = {}
  for (const name in style) {
    if (typeof style[name] === 'function') continue
    newStyle[name] = style[name]
  }
  return newStyle
}
