/**
 * Extracts a styles object with only props that contain function values.
 */
export default (styles: Object): Object|null => {
  let fnValuesCounter = 0

  // eslint-disable-next-line no-shadow
  function extract(styles: Object): Object {
    let to

    for (const key in styles) {
      const value = styles[key]
      const type = typeof value

      if (type === 'function') {
        if (!to) to = {}
        to[key] = value
        fnValuesCounter++
      }
      else if (type === 'object' && value !== null && !Array.isArray(value)) {
        if (!to) to = {}
        const extracted = extract(value)
        if (extracted) to[key] = extracted
      }
    }

    return to
  }

  const extracted = extract(styles)
  return fnValuesCounter ? extracted : null
}
