import DomRenderer from './DomRenderer'
import VirtualRenderer from './VirtualRenderer'

/**
 * Find proper renderer.
 * Option `virtual` is used to force use of VirtualRenderer even if DOM is
 * detected, used for testing only.
 *
 * @param {Object} options
 * @return {Renderer}
 * @api private
 */
export default function findRenderer(options) {
  if (options.Renderer) return options.Renderer
  return options.virtual || typeof document == 'undefined' ? VirtualRenderer : DomRenderer
}
