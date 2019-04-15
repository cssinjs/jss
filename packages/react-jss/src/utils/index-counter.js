// @flow

/**
 * Global index counter to preserve source order.
 * As we create the style sheet during componentWillMount lifecycle,
 * children are handled after the parents, so the order of style elements would
 * be parent->child. It is a problem though when a parent passes a className
 * which needs to override any childs styles. StyleSheet of the child has a higher
 * specificity, because of the source order.
 * So our solution is to render sheets them in the reverse order child->sheet, so
 * that parent has a higher specificity.
 */
let index = 0

const getIndex = () => {
  return index++
}

export {getIndex}
