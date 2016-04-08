/**
 * Rendering backend to do nothing in nodejs.
 */
export default class VirtualRenderer {
  static style() {}
  static setSelector() {}
  static getSelector() {}
  attach() {}
  detach() {}
  deploy() {}
  insertRule() {}
  getRules() {
    return {}
  }
}
