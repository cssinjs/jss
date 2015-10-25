/**
 * Rendering backend to do nothing in nodejs.
 */
export default class VirtualRenderer {
  attach() {}
  detach() {}
  deploy() {}
  insertRule() {}
  getRules() {
    return {}
  }
}
