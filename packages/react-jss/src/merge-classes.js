// @flow
import type {Classes} from 'jss'

/**
 * This merges to classes object.
 * When a property exists in both classes, it will not overwrite but merge the two classes.
 *
 * @param {Object} baseClasses - The base classes.
 * @param {Object} additionalClasses - The additional classes to merge on top of the base classes.
 * @return {Object} - Returns the merged classes object.
 */
function mergeClasses(baseClasses: Classes, additionalClasses: Classes) {
  const combinedClasses = {...baseClasses}

  for (const name in additionalClasses) {
    combinedClasses[name] =
      name in combinedClasses
        ? `${combinedClasses[name]} ${additionalClasses[name]}`
        : additionalClasses[name]
  }

  return combinedClasses
}

export default mergeClasses
