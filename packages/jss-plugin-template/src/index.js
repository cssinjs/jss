// @flow
import {type Plugin} from 'jss'
import parse from './parse'

export const cache = {}

type Options = {|cache: boolean|}

export default function templatePlugin(options: Options = {cache: true}): Plugin {
  const onProcessStyle = style => {
    if (typeof style !== 'string') {
      return style
    }

    if (style in cache) {
      return cache[style]
    }

    if (options.cache) {
      cache[style] = parse(style)
      return cache[style]
    }

    return parse(style)
  }

  return {onProcessStyle}
}
