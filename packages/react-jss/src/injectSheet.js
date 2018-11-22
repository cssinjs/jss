// @flow
import type {ComponentType, Node} from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import createHoc from './createHoc'
import type {Options, StylesOrCreator, InnerProps} from './types'

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
let indexCounter = -100000

const NoRenderer = (props: {children?: ?Node}) => props.children || null

/**
 * HOC creator function that wrapps the user component.
 *
 * `injectSheet(styles, [options])(Component)`
 */
export default function injectSheet(styles: StylesOrCreator, options?: Options = {}) {
  const index = options.index === undefined ? indexCounter++ : options.index

  return (InnerComponent: ComponentType<InnerProps> = NoRenderer) => {
    const Jss = createHoc(styles, InnerComponent, {...options, index})

    return hoistNonReactStatics(Jss, InnerComponent, {inner: true})
  }
}
