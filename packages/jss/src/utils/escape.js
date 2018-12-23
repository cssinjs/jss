const env = process.env.NODE_ENV

const escapeRegex = /([[\].#*$><+~=|^:(),"'`])/g

const nativeEscape = typeof CSS !== 'undefined' && CSS.escape

export default str => {
  // We don't need to escape it in production, because we are not using user's
  // input for selectors, we are generating a valid selector.
  if (env === 'production') return str

  return nativeEscape ? nativeEscape(str) : str.replace(escapeRegex, '\\$1')
}
