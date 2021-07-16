const mergeClasses = (baseClasses, additionalClasses) => {
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
