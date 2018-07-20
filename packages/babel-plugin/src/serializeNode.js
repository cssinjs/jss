import * as t from 'babel-types'
import generate from 'babel-generator'
import get from 'lodash/get'
import resolveRef from './resolveRef'
import getRefsCode from './getRefsCode'
import serializePropAccess from './serializePropAccess'

const getPropertyName = (path, property) => {
  const {name} = property.key
  if (!property.computed) return name
  return resolveRef(path, property.key).value
}

const hasThemeArg = (argNode, name) =>
  argNode.params.length !== 0 && name === argNode.params[0].name

const getValueByPath = (path, data, props) => {
  const value = get(data, props)
  if (value === undefined) {
    throw new Error(
      [
        `[JSS] Detected undefined property access: "${props.join('.')}".`,
        `Code: ${path.hub.file.code}`
      ].join('\n')
    )
  }
  return value
}

const serializeNode = (path, node, theme) => {
  if (t.isIdentifier(node)) {
    const refNode = resolveRef(path, node)
    if (refNode.name !== 'undefined') return serializeNode(path, refNode, theme)
    return null
  }

  if (t.isStringLiteral(node) || t.isNumericLiteral(node)) {
    return node.value
  }

  // injectSheet({a:  {}})
  if (t.isObjectExpression(node)) {
    return node.properties.reduce((serialized, property) => {
      const value = serializeNode(path, property.value, theme)
      if (value !== null) {
        const key = getPropertyName(path, property)
        serialized[key] = value
      }
      return serialized
    }, {})
  }

  // injectSheet({a:  {margin: [0, 1]}})
  if (t.isArrayExpression(node)) {
    return node.elements.map(elementNode => serializeNode(path, elementNode, theme))
  }

  // Styles are defined by a function whith a theme argument
  // `injectSheet((theme) => ({a: {color: theme.primary}}))`.
  // We enter this on `theme.primary`.
  if (t.isMemberExpression(node)) {
    const {object, props} = serializePropAccess(node)

    if (props[0] in path.scope.bindings) {
      const data = serializeNode(path, path.scope.bindings[props[0]].identifier, theme)
      if (!data) return null
      return getValueByPath(path, data, props.slice(1))
    }

    // When object name we are accessing is the argument name.
    const firstArgNode = resolveRef(path, path.node.arguments[0])
    if (t.isFunction(firstArgNode) && hasThemeArg(firstArgNode, object.name)) {
      return getValueByPath(path, theme, props.slice(1))
    }
  }

  // injectSheet({a:  {left: 1 + 2}}) || injectSheet(getStyles(5))
  if (t.isBinaryExpression(node) || t.isCallExpression(node)) {
    const refsCode = getRefsCode(path)
    const {code} = generate(node)
    // eslint-disable-next-line no-eval
    return eval(`${refsCode}(${code})`)
  }

  return null
}
export default serializeNode
