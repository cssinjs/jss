/**
 * Rendering backend to do nothing in nodejs.
 */
export default class VirtualRenderer {
  createElement() {}
  style() {}
  selector() {}
  attach() {}
  detach() {}
  deploy() {}
  insertRule() {}
  deleteRule() {}
  getRules() {
    return {}
  }
}
