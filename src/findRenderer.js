import DomRenderer from './backends/DomRenderer'
import VirtualRenderer from './backends/VirtualRenderer'
import isBrowser from 'is-browser'

/**
 * Find proper renderer.
 * Option `virtual` is used to force use of VirtualRenderer even if DOM is
 * detected, used for testing only.
 *
 * @param {Object} options
 * @return {Renderer}
 * @api private
 */
export default function findRenderer(options = {}) {
  if (options.Renderer) return options.Renderer
  return options.virtual || !isBrowser ? VirtualRenderer : DomRenderer
}
