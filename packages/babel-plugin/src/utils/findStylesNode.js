import * as t from 'babel-types'
import resolveRef from './resolveRef'

export default callPath => {
  const node = resolveRef(callPath, callPath.node.arguments[0])
  // injectSheet({}) || injectSheet(getStyles())
  if (t.isObjectExpression(node) || t.isCallExpression(node)) {
    return node
  }

  // Unsupported type.
  if (!t.isFunction(node)) {
    return null
  }

  // injectSheet(() => ({}))
  if (t.isObjectExpression(node.body)) {
    return node.body
  }

  // injectSheet(() => { return {} })
  const returnNodes = node.body.body.filter(t.isReturnStatement)
  // Currently we take only the last return value.
  return returnNodes[returnNodes.length - 1].argument
}
