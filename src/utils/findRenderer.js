/* @flow */
import isInBrowser from 'is-in-browser'
import DomRenderer from '../backends/DomRenderer'
import VirtualRenderer from '../backends/VirtualRenderer'
import type {RuleOptions, StyleSheetOptions} from '../types'

/**
 * Find proper renderer.
 * Option `virtual` is used to force use of VirtualRenderer even if DOM is
 * detected, used for testing only.
 */
export default function findRenderer(options: StyleSheetOptions|RuleOptions = {}): any {
  if (options.Renderer) return options.Renderer
  const useVirtual = options.virtual || !isInBrowser
  return useVirtual ? VirtualRenderer : DomRenderer
}
