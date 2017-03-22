/**
 * Based on deepFreezeAndThrowOnMutationInDev from react-native package.
 */

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule deepFreezeAndThrowOnMutationInDev
 * @flow
 */

declare var __DEV__: boolean

const identity = value => value

const throwOnMutation = (objectName, key, value) => {
  throw Error(`
    You attempted to set the key ${key} with the value
    ${JSON.stringify(value)} on the object ${objectName} that is meant to be immutable
    and has been frozen.
  `)
}

/**
 * If your application is accepting different values for the same field over
 * time and is doing a diff on them, you can either (1) create a copy or
 * (2) ensure that those values are not mutated behind two passes.
 * This function helps you with (2) by freezing the object and throwing if
 * the user subsequently modifies the value.
 *
 * There are two caveats with this function:
 *   - If the call site is not in strict mode, it will only throw when
 *     mutating existing fields, adding a new one
 *     will unfortunately fail silently :(
 *   - If the object is already frozen or sealed, it will not continue the
 *     deep traversal and will leave leaf nodes unfrozen.
 *
 * Freezing the object and adding the throw mechanism is expensive and will
 * only be used in DEV.
 */
export default function deepFreeze(object: Object, objectName?: string = '') {
  if (!__DEV__) return

  if (
    typeof object !== 'object' ||
    object === null ||
    Object.isFrozen(object) ||
    Object.isSealed(object)
  ) return

  const keys = Object.keys(object)

  keys.forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(object, key)) return
    Object.defineProperty(object, key, {
      enumerable: true,
      get: identity.bind(null, object[key]),
      set: throwOnMutation.bind(null, objectName, key)
    })
  })

  Object.freeze(object)
  Object.seal(object)

  keys.forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(object, key)) return
    deepFreeze(object[key])
  })
}
