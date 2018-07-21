import * as t from 'babel-types'
import serializePropAccess from './serializePropAccess'
import isFromImport from './isFromImport'
import {ruleName as rawRuleName} from './insertRawRule'
import resolveRef from './resolveRef'

const removeNonFunctionProps = (path, stylesNode) => {
  if (!t.isObjectExpression(stylesNode)) return

  stylesNode.properties = stylesNode.properties.filter(node => {
    if (node.key.value === rawRuleName || t.isFunction(node.value)) {
      return true
    }
    if (t.isObjectExpression(node.value)) {
      removeNonFunctionProps(path, node.value)
      return true
    }
    if (t.isIdentifier(node.value)) {
      const refNode = resolveRef(path, node.value)
      return t.isFunction(refNode)
    }

    if (t.isMemberExpression(node.value)) {
      const {props} = serializePropAccess(node.value)
      const binding = path.scope.bindings[props[0]]
      if (binding && isFromImport(binding.path.parent)) {
        return true
      }
    }

    return false
  })
}

export default removeNonFunctionProps
