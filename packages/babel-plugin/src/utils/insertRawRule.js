import * as t from 'babel-types'

export const ruleName = '@raw'

export default (callPath, stylesNode, sheet) => {
  const raw = t.objectProperty(t.stringLiteral(ruleName), t.stringLiteral(sheet.toString()))

  // createStyleSheet(getStyles())
  if (t.isCallExpression(stylesNode)) {
    callPath.node.arguments[0] = t.objectExpression([raw])
    return
  }

  // Insert @raw before the first rule in styles.
  stylesNode.properties.unshift(raw)
}
