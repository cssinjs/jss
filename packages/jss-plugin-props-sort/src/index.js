/**
 * Sort props by length.
 */
export default function jssPropsSort() {
  function sort(prop0, prop1) {
    return prop0.length - prop1.length
  }

  function onProcessStyle(style, rule) {
    if (rule.type !== 'style') return style

    const newStyle = {}
    const props = Object.keys(style).sort(sort)
    for (const prop in props) {
      newStyle[props[prop]] = style[props[prop]]
    }
    return newStyle
  }

  return {onProcessStyle}
}
