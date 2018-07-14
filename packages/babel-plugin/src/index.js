import {declare} from '@babel/helper-plugin-utils'
import {create as createJss} from 'jss'

const rawRuleName = '@raw'
const defaultIdentifiers = ['createStyleSheet', 'injectSheet']

export default declare(({types: t, ...api}, {identifiers = defaultIdentifiers, jssOptions}) => {
  api.assertVersion(7)

  const extracStaticStylesObject = callPath => {
    const stylesArg = callPath.node.arguments[0]

    if (!t.isObjectExpression(stylesArg)) {
      return null
    }

    const getPropertyName = property => {
      const {name} = property.key
      if (!property.computed) return name
      return callPath.scope.getBinding(name).path.node.init.value
    }

    const serializeValue = value => {
      if (t.isStringLiteral(value) || t.isNumericLiteral(value)) {
        return value.value
      }

      if (t.isObjectExpression(value)) {
        return value.properties.reduce((serialized, property) => {
          serialized[getPropertyName(property)] = serializeValue(property.value)
          return serialized
        }, {})
      }

      if (t.isArrayExpression(value)) {
        return value.elements.map(serializeValue)
      }

      // TODO array
      return null
    }

    return serializeValue(stylesArg)
  }

  const jss = createJss(jssOptions)

  return {
    visitor: {
      CallExpression(callPath) {
        if (!identifiers.includes(callPath.node.callee.name)) return

        const styles = extracStaticStylesObject(callPath)
        if (!styles) return

        const sheet = jss.createStyleSheet(styles)

        // Insert @raw before the first rule in styles.
        callPath.traverse({
          ObjectProperty(propPath) {
            propPath.insertBefore(
              t.objectProperty(t.stringLiteral(rawRuleName), t.stringLiteral(sheet.toString()))
            )
            propPath.stop()
          }
        })

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

        // Remove empty objects
        callPath.traverse({
          ObjectProperty(propPath) {
            const {value} = propPath.node
            if (t.isObjectExpression(value) && value.properties.length === 0) {
              propPath.remove()
            }
          }
        })

        // Insert options argument.
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
        callPath.replaceWith(t.callExpression(callPath.node.callee, args))
        // This will avoid circular traversing.
        // TODO to support multiple calls this won't work?
        callPath.stop()
      }
    }
  }
})
