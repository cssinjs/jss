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
        // eslint-disable-next-line no-use-before-define
        return serializeObject(value)
      }

      // TODO array
      return null
    }

    const serializeObject = object =>
      object.properties.reduce((serialized, property) => {
        serialized[getPropertyName(property)] = serializeValue(property.value)
        return serialized
      }, {})

    return serializeObject(stylesArg)
  }

  const jss = createJss(jssOptions)

  return {
    visitor: {
      CallExpression(path) {
        const {name} = path.node.callee
        if (!identifiers.includes(name)) return

        const styles = extracStaticStylesObject(path)
        if (!styles) return
        const css = jss.createStyleSheet(styles).toString()

        // Insert @raw before the first rule in styles.
        path.traverse({
          ObjectProperty(propPath) {
            propPath.insertBefore(
              t.objectProperty(t.stringLiteral(rawRuleName), t.stringLiteral(css))
            )
            propPath.stop()
          }
        })

        // Remove none-function properties
        path.traverse({
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
        path.traverse({
          ObjectProperty(propPath) {
            const {value} = propPath.node
            if (t.isObjectExpression(value) && value.properties.length === 0) {
              propPath.remove()
            }
          }
        })
      }
    }
  }
})
