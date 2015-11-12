/**
 * Rendering backend to do nothing in nodejs.
 */
export default class VirtualRenderer {
  static style() {}
  attach() {}
  detach() {}
  deploy() {}
  insertRule() {}
  getRules() {
    return {}
  }
}
