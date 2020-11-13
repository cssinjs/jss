// @flow
import type {Classes} from 'jss'

type MergeClasses = (Classes, Classes) => Classes

const mergeClasses: MergeClasses = (baseClasses, additionalClasses) => {
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
