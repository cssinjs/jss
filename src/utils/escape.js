import warning from 'warning'
import global from './global'

const CSS = (global.CSS: any)

const env = process.env.NODE_ENV

export default (str) => {
  // We don't need to escape it in production, because we are not using user's
  // input for selectors, we are generating a selector completely.
  if (env === 'production') return str

  if (!CSS || !CSS.escape) {
    warning(
      false,
      '[JSS] CSS.escape polyfill in DEV mode is required in this browser, ' +
      'check out https://github.com/mathiasbynens/CSS.escape'
    )
    return str
  }

  return CSS.escape(str)
}
