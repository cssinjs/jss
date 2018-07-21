import * as t from 'babel-types'

export default node =>
  t.isImportDeclaration(node) || t.isImportSpecifier(node) || t.isImportDefaultSpecifier(node)
