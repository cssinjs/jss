import * as t from 'babel-types'
import isFromImport from './isFromImport'
import resolveRef from './resolveRef'

export default (callPath, classesNode) => {
  const prevOptionsNode = resolveRef(callPath, callPath.node.arguments[1])

  if (t.isObjectExpression(prevOptionsNode)) {
    prevOptionsNode.properties.unshift(classesNode)
    return
  }

  // Convert an imported `options` identifier to Object.assign({classes}, options)
  if (isFromImport(prevOptionsNode)) {
    const assignCall = t.callExpression(
      t.memberExpression(t.identifier('Object'), t.identifier('assign')),
      [t.objectExpression([classesNode]), prevOptionsNode.local]
    )
    callPath.node.arguments[1] = assignCall
    return
  }

  callPath.node.arguments.push(t.objectExpression([classesNode]))
}
