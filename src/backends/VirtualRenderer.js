/* @flow */
/* eslint-disable class-methods-use-this */

/**
 * Rendering backend to do nothing in nodejs.
 */
export default class VirtualRenderer {
  createElement(): any {}
  style(): any {}
  selector(): any {}
  attach(): any {}
  detach(): any {}
  deploy(): any {}
  insertRule(): any {}
  deleteRule(): any {}
  getRules(): any {
    return []
  }
}
