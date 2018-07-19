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
    const props = Object.keys(style).sort(sort)
    props.forEach(prop => {
      newStyle[prop] = style[prop]
    })
    return newStyle
  }

  return {onProcessStyle}
}
