/**
 * Extracts a styles object with only props that contain function values.
 */
export default (styles: Object): Object | null => {
  // eslint-disable-next-line no-shadow
  function extract(styles: Object): Object {
    let to = null

    for (const key in styles) {
      const value = styles[key]
      const type = typeof value

      if (type === 'function') {
        if (!to) to = {}
        to[key] = value
      } else if (type === 'object' && value !== null && !Array.isArray(value)) {
        const extracted = extract(value)
        if (extracted) {
          if (!to) to = {}
          to[key] = extracted
        }
      }
    }

    return to
  }

  return extract(styles)
}
