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
    for (const name in classes[i]) {
      composedClasses[name] = composedClasses[name]
        ? `${composedClasses[name]} ${classes[i][name]}`
        : classes[i][name]
    }
  }

  return composedClasses
}
