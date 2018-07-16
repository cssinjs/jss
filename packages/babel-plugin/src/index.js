import {declare} from '@babel/helper-plugin-utils'
import {create as createJss} from 'jss'
import preset from 'jss-preset-default'
import get from 'lodash/get'

const rawRuleName = '@raw'
const defaultIdentifiers = [
  // Core JSS.
  'createStyleSheet',
  // React-JSS
  'injectSheet',
  // Material-UI
  'withStyles',
  'createStyled'
]

export default declare(
  ({types: t, ...api}, {identifiers = defaultIdentifiers, jssOptions = preset(), theme = {}}) => {
    api.assertVersion(7)

    const resolveRef = (path, node) => {
      if (t.isIdentifier(node) && node.name !== 'undefined') {
        const refNode = path.scope.getBinding(node.name).path.node
        return refNode.init || refNode
      }
      return node
    }

    const isFromImport = node =>
      t.isImportDeclaration(node) || t.isImportSpecifier(node) || t.isImportDefaultSpecifier(node)

    const serializePropAcces = node => {
      // Find the `theme` object.
      let object = node
      // Aggregate a props access chain: `theme.x[0].color` => `['theme', 'c', 0, 'color']`
      const props = [object.property.name || object.property.value]
      while (object.object) {
        // Find the first object we are accessing.
        object = object.object
        props.unshift(object.name || object.property.name || object.property.value)
      }
      return {object, props}
    }

    const serializeNode = (() => {
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

      return (path, node) => {
        if (t.isIdentifier(node)) {
          const refNode = resolveRef(path, node)
          if (refNode.name !== 'undefined') return serializeNode(path, refNode)
          return null
        }

        if (t.isStringLiteral(node) || t.isNumericLiteral(node)) {
          return node.value
        }

        if (t.isObjectExpression(node)) {
          return node.properties.reduce((serialized, property) => {
            const value = serializeNode(path, property.value)
            if (value !== null) {
              const key = getPropertyName(path, property)
              serialized[key] = value
            }
            return serialized
          }, {})
        }

        if (t.isArrayExpression(node)) {
          return node.elements.map(elementNode => serializeNode(path, elementNode))
        }

        // Styles are defined by a function whith a theme argument
        // `injectSheet((theme) => ({a: {color: theme.primary}}))`.
        // We enter this on `theme.primary`.
        if (t.isMemberExpression(node)) {
          const {object, props} = serializePropAcces(node)

          if (props[0] in path.scope.bindings) {
            const data = serializeNode(path, path.scope.bindings[props[0]].identifier)
            if (!data) return null
            return getValueByPath(path, data, props.slice(1))
          }

          // When object name we are accessing is the argument name.
          const firstArgNode = resolveRef(path, path.node.arguments[0])
          if (t.isFunction(firstArgNode) && hasThemeArg(firstArgNode, object.name)) {
            return getValueByPath(path, theme, props.slice(1))
          }
        }

        return null
      }
    })()

    const insertRawRule = (stylesNode, sheet) => {
      // Insert @raw before the first rule in styles.
      stylesNode.properties.unshift(
        t.objectProperty(t.stringLiteral(rawRuleName), t.stringLiteral(sheet.toString()))
      )
    }

    const removeNonFunctionProps = (path, stylesNode) => {
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
          const {props} = serializePropAcces(node.value)
          const binding = path.scope.bindings[props[0]]
          if (binding && isFromImport(binding.path.parent)) {
            return true
          }
        }

        return false
      })
    }

    const removeEmptyObjects = stylesNode => {
      if (!t.isObjectExpression(stylesNode)) return
      stylesNode.properties = stylesNode.properties.filter(node => {
        if (!t.isObjectExpression(node.value)) return true
        if (node.value.properties.length === 0) {
          return false
        }
        node.value.properties.forEach(removeEmptyObjects)
        return true
      })
    }

    // {classes: {ruleName: className}}
    const buildClassesNode = sheet =>
      t.objectProperty(
        t.stringLiteral('classes'),
        t.objectExpression(
          Object.keys(sheet.classes).map(name =>
            t.objectProperty(t.stringLiteral(name), t.stringLiteral(sheet.classes[name]))
          )
        )
      )

    const extendOptions = (callPath, classesNode) => {
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

    const findStylesNode = callPath => {
      const node = resolveRef(callPath, callPath.node.arguments[0])

      // injectSheet({})
      if (t.isObjectExpression(node)) {
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

      const returnNodes = node.body.body.filter(t.isReturnStatement)

      // Currently we take only the last return value
      return returnNodes[returnNodes.length - 1].argument
    }

    const jss = createJss(jssOptions)

    return {
      visitor: {
        CallExpression(callPath) {
          if (!identifiers.includes(callPath.node.callee.name)) return

          const stylesNode = findStylesNode(callPath)
          const styles = serializeNode(callPath, stylesNode)
          const sheet = jss.createStyleSheet(styles)

          if (!sheet.toString()) return

          insertRawRule(stylesNode, sheet)
          removeNonFunctionProps(callPath, stylesNode)
          removeEmptyObjects(stylesNode)
          extendOptions(callPath, buildClassesNode(sheet))
        }
      }
    }
  }
)
