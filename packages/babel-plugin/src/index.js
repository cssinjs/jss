import {declare} from '@babel/helper-plugin-utils'
import {create as createJss} from 'jss'
import preset from 'jss-preset-default'
import pluginRuleValueFn from 'jss-plugin-syntax-rule-value-function'

const rawRuleName = '@raw'
const defaultIdentifiers = ['createStyleSheet', 'injectSheet']

// TODO remove this plugin after migration to monorepo.
// Don't release with this.
const defaultJssOptions = preset()
defaultJssOptions.plugins.unshift(pluginRuleValueFn())

export default declare(
  ({types: t, ...api}, {identifiers = defaultIdentifiers, jssOptions = defaultJssOptions}) => {
    api.assertVersion(7)

    const resolveRef = (path, node) => {
      if (t.isIdentifier(node) && node.name !== 'undefined') {
        const refNode = path.scope.getBinding(node.name).path.node
        return refNode.init || refNode
      }
      return node
    }

    const serializeNode = (() => {
      const getPropertyName = (path, property) => {
        const {name} = property.key
        if (!property.computed) return name
        return resolveRef(path, property.key).value
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
            serialized[getPropertyName(path, property)] = serializeNode(path, property.value)
            return serialized
          }, {})
        }

        if (t.isArrayExpression(node)) {
          return node.elements.map(elementNode => serializeNode(path, elementNode))
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

    const isImport = node => t.isImportSpecifier(node) || t.isImportDefaultSpecifier(node)

    const extendOptions = (callPath, classesNode) => {
      const prevOptionsNode = resolveRef(callPath, callPath.node.arguments[1])

      if (t.isObjectExpression(prevOptionsNode)) {
        prevOptionsNode.properties.unshift(classesNode)
        return
      }

      // Convert an imported `options` identifier to Object.assign({classes}, options)
      if (isImport(prevOptionsNode)) {
        const assignCall = t.callExpression(
          t.memberExpression(t.identifier('Object'), t.identifier('assign')),
          [t.objectExpression([classesNode]), prevOptionsNode.local]
        )
        callPath.node.arguments[1] = assignCall
        return
      }

      callPath.node.arguments.push(t.objectExpression([classesNode]))
    }

    const jss = createJss(jssOptions)

    return {
      visitor: {
        CallExpression(callPath) {
          if (!identifiers.includes(callPath.node.callee.name)) return
          const stylesNode = resolveRef(callPath, callPath.node.arguments[0])
          const styles = serializeNode(callPath, stylesNode)

          if (!styles) return

          const sheet = jss.createStyleSheet(styles)

          insertRawRule(stylesNode, sheet)
          removeNonFunctionProps(callPath, stylesNode)
          removeEmptyObjects(stylesNode)
          extendOptions(callPath, buildClassesNode(sheet))
        }
      }
    }
  }
)
