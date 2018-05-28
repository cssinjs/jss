const CSS = (global.CSS: any)

const env = process.env.NODE_ENV

const escapeRegex = /([[\].#*$><+~=|^:(),"'`])/g

export default str => {
  // We don't need to escape it in production, because we are not using user's
  // input for selectors, we are generating a valid selector.
  if (env === 'production') return str

  if (!CSS || !CSS.escape) {
    return str.replace(escapeRegex, '\\$1')
  }

  return CSS.escape(str)
}
