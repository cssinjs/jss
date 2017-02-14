const extract = (from) => {
  let to
  for (const key in from) {
    const value = from[key]
    const type = typeof value

    if (type === 'function') {
      if (!to) to = {}
      to[key] = value
    }
    else if (type === 'object' && value !== null && !Array.isArray(value)) {
      if (!to) to = {}
      const extracted = extract(value)
      if (extracted) to[key] = extracted
    }
  }

  return to
}

/**
 * Extracts a styles object with only rules that contain function values.
 */
export default (styles: Object): Object => extract(styles)
