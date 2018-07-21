import * as t from 'babel-types'

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

export default removeEmptyObjects
