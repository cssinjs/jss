import * as t from 'babel-types'
import get from 'lodash/get'

const defaultIdentifiers = [
  {
    package: /^jss/,
    functions: ['createStyleSheet']
  },
  {
    package: /^react-jss/,
    functions: ['injectSheet']
  },
  {
    package: /^@material-ui/,
    functions: ['withStyles', 'createStyled']
  }
]

export default (callPath, identifiers = defaultIdentifiers) => {
  // createStyleSheet() ||  jss.createStyleSheet()
  const identifier = get(callPath, 'node.callee.name') || get(callPath, 'node.callee.property.name')

  // Check if function call with a white-listed identifier is found.
  const conf = identifiers.filter(def => def.functions.includes(identifier)).map(def => {
    if (typeof def.package === 'string') {
      return {
        ...def,
        package: new RegExp(def.package)
      }
    }
    return def
  })[0]

  if (!conf) return false

  let isPackageImported = false

  // Check if the package name that corresponse to the identifier is found in
  // imports.
  callPath.findParent(programPath => {
    if (!t.isProgram(programPath)) return
    programPath.traverse({
      ImportDeclaration(importPath) {
        if (conf.package.test(importPath.node.source.value)) {
          isPackageImported = true
          importPath.stop()
        }
      }
    })
  })

  return isPackageImported
}
