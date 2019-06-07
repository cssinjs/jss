// Original code is https://github.com/moroshko/shallow-equal/blob/master/src/objects.js
// Created issue https://github.com/moroshko/shallow-equal/issues/7
// We had to copy that because we need an ESM module.

const shallowEqualObjects = (objA, objB) => {
  if (objA === objB) {
    return true
  }

  if (!objA || !objB) {
    return false
  }

  const aKeys = Object.keys(objA)
  const bKeys = Object.keys(objB)
  const len = aKeys.length

  if (bKeys.length !== len) {
    return false
  }

  for (let i = 0; i < len; i++) {
    const key = aKeys[i]

    if (objA[key] !== objB[key]) {
      return false
    }
  }

  return true
}

export default shallowEqualObjects
