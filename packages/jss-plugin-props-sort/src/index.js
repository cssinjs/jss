// @flow
import type {Plugin} from 'jss'

/**
 * Sort props by length.
 */
export default function jssPropsSort(): Plugin {
  function sort(prop0, prop1) {
    return prop0.length - prop1.length
  }

  function onProcessStyle(style, rule) {
    if (rule.type !== 'style') return style

    const newStyle = {}
    const props: string[] = Object.keys(style).sort(sort)
    for (const prop of props) {
      newStyle[prop] = style[prop]
    }
    return newStyle
  }

  return {onProcessStyle}
}
