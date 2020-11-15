// @flow
/* eslint-disable prefer-rest-params, prefer-spread */
import * as React from 'react'
import defaultCss, {type Css} from 'css-jss'

type CreateElement = (type: string, props: Object | null /* :: , ..._args: any */) => React.Node
type Create = (Css | void) => CreateElement

export const create: Create = (css: Css = defaultCss) =>
  function createElement(type: string, props: Object | null /* :: , ..._args: any */) {
    const args = arguments
    if (props && props.css) {
      const className = css(props.css)
      const newProps = Object.assign({}, props)
      newProps.className = props.className ? `${props.className} ${className}` : className
      delete newProps.css
      args[1] = newProps
    }
    // $FlowFixMe[missing-arg]
    return React.createElement.apply(undefined, args)
  }
const createElement: CreateElement = create()
export default createElement
