import {uid} from '../utils'

/**
 * Create a base rule object.
 *
 * @param {String} type
 * @param {Object} options
 * @return {Object}
 */
export default function createBaseRule(type, options) {
  return {
    id: uid.get(),
    type,
    isRule: true,
    ...options
  }
}
