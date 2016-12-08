/* @flow */
/* eslint-disable class-methods-use-this */

/**
 * Rendering backend to do nothing in nodejs.
 */
export default class VirtualRenderer {
  createElement() {}
  setStyle() {}
  getStyle() {}
  setSelector() {}
  getSelector() {}
  attach() {}
  detach() {}
  deploy() {}
  insertRule() {}
  deleteRule() {}
  getRules() {}
}
