import {declare} from '@babel/helper-plugin-utils'
import {create as createJss} from 'jss'

const rawRuleName = '@raw'
const defaultIdentifiers = ['createStyleSheet', 'injectSheet']

export default declare(({types: t, ...api}, {identifiers = defaultIdentifiers, jssOptions}) => {
  api.assertVersion(7)

  const serializeNode = (() => {
    const getPropertyName = (path, property) => {
      const {name} = property.key
      if (!property.computed) return name
      return path.scope.getBinding(name).path.node.init.value
    }

    return (path, value) => {
      if (t.isStringLiteral(value) || t.isNumericLiteral(value)) {
        return value.value
      }

      if (t.isObjectExpression(value)) {
        return value.properties.reduce((serialized, property) => {
          serialized[getPropertyName(path, property)] = serializeNode(path, property.value)
          return serialized
        }, {})
      }

      if (t.isArrayExpression(value)) {
        return value.elements.map(node => serializeNode(path, node))
      }

      return null
    }
  })()

  const insertRawRule = (callPath, sheet) => {
    // Insert @raw before the first rule in styles.
    callPath.traverse({
      ObjectProperty(propPath) {
        propPath.insertBefore(
          t.objectProperty(t.stringLiteral(rawRuleName), t.stringLiteral(sheet.toString()))
        )
        propPath.stop()
      }
    })
  }

  const removeNonFunctionProps = callPath => {
    // Remove none-function properties
    callPath.traverse({
      ObjectProperty(propPath) {
        const {value} = propPath.node
        if (
          t.isObjectExpression(value) ||
          t.isArrowFunctionExpression(value) ||
          t.isFunctionExpression(value) ||
          t.isIdentifier(value) ||
          propPath.node.key.value === rawRuleName
        ) {
          return
        }
        propPath.remove()
      }
    })
  }

  const removeEmptyObjects = callPath => {
    // Remove empty objects
    callPath.traverse({
      ObjectProperty(propPath) {
        const {value} = propPath.node
        if (t.isObjectExpression(value) && value.properties.length === 0) {
          propPath.remove()
        }
      }
    })
  }

  const replaceCallWithNewArgs = (callPath, sheet) => {
    // Build options = {classes: {ruleName: className}}
    const optionsNode = t.objectExpression([
      t.objectProperty(
        t.stringLiteral('classes'),
        t.objectExpression(
          Object.keys(sheet.classes).map(name =>
            t.objectProperty(t.stringLiteral(name), t.stringLiteral(sheet.classes[name]))
          )
        )
      )
    ])

    const args = [callPath.node.arguments[0], optionsNode]
    // We have to replace the call because it seems there is no way to just
    // add an argument.
    callPath.replaceWith(t.callExpression(callPath.node.callee, args))
  }

  const jss = createJss(jssOptions)

  return {
    visitor: {
      CallExpression(callPath) {
        if (!identifiers.includes(callPath.node.callee.name)) return

        const styles = serializeNode(callPath, callPath.node.arguments[0])

        if (!styles) return

        const sheet = jss.createStyleSheet(styles)

        insertRawRule(callPath, sheet)
        removeNonFunctionProps(callPath)
        removeEmptyObjects(callPath)
        replaceCallWithNewArgs(callPath, sheet)
        // This will avoid circular traversing after r
        // TODO to support multiple calls this won't work?
        callPath.stop()
      }
    }
  }
})
