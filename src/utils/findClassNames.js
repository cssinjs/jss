const dotsRegExp = /[.]/g
const classesRegExp = /[.][^ ,]+/g

/**
 * Get class names from a selector.
 *
 * @param {String} selector
 * @return {String}
 */
export default function findClassNames(selector) {
  const classes = selector.match(classesRegExp)

  if (!classes) return ''

  return classes
    .join(' ')
    .replace(dotsRegExp, '')
}
