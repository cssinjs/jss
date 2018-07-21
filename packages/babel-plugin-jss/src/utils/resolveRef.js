import * as t from 'babel-types'

export default (path, node) => {
  if (t.isIdentifier(node) && node.name !== 'undefined') {
    const refNode = path.scope.getBinding(node.name).path.node
    return refNode.init || refNode
  }
  return node
}
