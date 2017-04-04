/**
 * Extracts a styles object with only props that contain function values.
 */
export default (styles: Object): Object|null => {
  let fnValuesCounter = 0

  // eslint-disable-next-line no-shadow
  function extract(styles: Object): Object {
    const to = {}

    for (const key in styles) {
      const value = styles[key]
      const type = typeof value

      if (type === 'function') {
        to[key] = value
        fnValuesCounter++
      }
      else if (type === 'object' && value !== null && !Array.isArray(value)) {
        const extracted = extract(value)
        if (extracted) to[key] = extracted
      }
    }

    return Object.keys(to).length > 0 && to
  }

  const extracted = extract(styles)
  return fnValuesCounter ? extracted : null
}
