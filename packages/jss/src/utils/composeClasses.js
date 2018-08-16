// @flow

import type {Classes} from '../types'

/**
 * Compose multiple class object and merge the class names for the same keys.
 *
 * @param {...Object} classes - Any amount of additional class objects to be merged.
 * @returns {Object} Returns the composed classes.
 */
export default function composeClasses(firstClasses: Classes, ...classes: Classes[]) {
  const composedClasses = {...firstClasses}

  for (let i = 0; i < classes.length; i++) {
    const keys = Object.keys(classes[i])

    for (let j = 0; j < keys.length; j++) {
      const key = keys[j]

      composedClasses[key] = composedClasses[key]
        ? `${composedClasses[key]} ${classes[i][key]}`
        : classes[i][key]
    }
  }

  return composedClasses
}
