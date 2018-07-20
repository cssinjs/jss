import generate from 'babel-generator'
import * as t from 'babel-types'

export default callPath => {
  const nodes = []
  const skip = []
  callPath.findParent(programPath => {
    if (!t.isProgram(programPath)) return
    programPath.traverse({
      VariableDeclaration(path) {
        nodes.push(path.node)
        // Function expression will result in variable declaration and
        // function extracted separately, duplicating the fn.
        // We need to skip functions which are already part of a var decl.
        // const a = () => {}
        path.node.declarations.forEach(node => {
          if (t.isFunction(node.init)) {
            skip.push(node.init)
          }
        })
      },
      Function(path) {
        if (!skip.includes(path.node)) {
          nodes.push(path.node)
        }
      }
    })
  })
  return nodes.map(node => generate(node).code).join('\n')
}
