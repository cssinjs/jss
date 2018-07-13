import {declare} from '@babel/helper-plugin-utils'
import {types as t} from '@babel/core'
import {create as createJss} from 'jss'

const rawRuleName = '@raw'
const defaultIdentifiers = ['createStyleSheet', 'injectSheet']

export default declare((api, {identifiers = defaultIdentifiers, jssOptions}) => {
  api.assertVersion(7)

  // TODO:
  // - remove eval
  // - resolve refs
  const extractStylesObject = path => {
    const {code} = path.hub.file
    const {start, end} = path.node.arguments[0]
    const stylesStr = code.substring(start, end)
    // eslint-disable-next-line no-eval
    return eval(`(${stylesStr})`)
  }

  const jss = createJss(jssOptions)

  return {
    visitor: {
      CallExpression(path) {
        const {name} = path.node.callee
        if (!identifiers.includes(name)) return

        const styles = extractStylesObject(path)
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
            // TODO add regular functions and refs
            const {value} = propPath.node
            if (
              t.isObjectExpression(value) ||
              t.isArrowFunctionExpression(value) ||
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
