const env = process.env.NODE_ENV
const escapeRegex = /([[\].#*$><+~=|^:(),"'`\s])/g

export default str => {
  // We don't need to escape it in production, because we are not using user's
  // input for selectors, we are generating a valid selector.
  if (env === 'production') return str

  const nativeEscape = typeof CSS !== 'undefined' && CSS.escape

  return nativeEscape ? nativeEscape(str) : str.replace(escapeRegex, '\\$1')
}
