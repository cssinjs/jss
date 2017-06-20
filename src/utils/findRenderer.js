/* @flow */
import isInBrowser from 'is-in-browser'
import DomRenderer from '../renderers/DomRenderer'
import VirtualRenderer from '../renderers/VirtualRenderer'
import type {JssOptions, Renderer} from '../types'

/**
 * Find proper renderer.
 * Option `virtual` is used to force use of VirtualRenderer even if DOM is
 * detected, used for testing only.
 */
export default function findRenderer(options: JssOptions = {}): Class<Renderer> {
  if (options.Renderer) return options.Renderer
  const useVirtual = options.virtual || !isInBrowser
  return useVirtual ? VirtualRenderer : DomRenderer
}
