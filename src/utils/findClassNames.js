/* @flow */
const dotsRegExp = /[.]/g
const classesRegExp = /[.][^ ,]+/g

/**
 * Get class names from a selector.
 */
export default function findClassNames(selector: string): string {
  const classes = selector.match(classesRegExp)

  if (!classes) return ''

  return classes
    .join(' ')
    .replace(dotsRegExp, '')
}
