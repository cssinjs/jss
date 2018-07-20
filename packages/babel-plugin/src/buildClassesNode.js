import * as t from 'babel-types'

// {classes: {ruleName: className}}
export default sheet =>
  t.objectProperty(
    t.stringLiteral('classes'),
    t.objectExpression(
      Object.keys(sheet.classes).map(name =>
        t.objectProperty(t.stringLiteral(name), t.stringLiteral(sheet.classes[name]))
      )
    )
  )
