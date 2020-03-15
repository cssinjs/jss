// @flow
import {type JssStyles} from 'jss'
/**
 * Extracts a styles object with only props that contain function values.
 */
const getDynamicStyles = (styles: JssStyles): JssStyles | void => {
  let to

  for (const key in styles) {
    const value = styles[key]
    const type = typeof value

    if (type === 'function') {
      if (!to) to = {}
      to[key] = value
    } else if (type === 'object' && value !== null && !Array.isArray(value)) {
      const extracted = getDynamicStyles(value)
      if (extracted) {
        if (!to) to = {}
        to[key] = extracted
      }
    }
  }

  return to
}

export default getDynamicStyles
