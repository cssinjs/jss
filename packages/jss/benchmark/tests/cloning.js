import styles from '../fixtures/regular.json'

const Fn = () => null

function protoClone(style) {
  Fn.prototype = style
  return new Fn()
}

function walkClone(style) {
  const newStyle = {}
  for (const name in style) {
    newStyle[name] = style[name]
  }
  return newStyle
}

function assign(style) {
  return Object.assign({}, style)
}

function jsonClone(style) {
  return JSON.parse(JSON.stringify(style))
}

function use(obj) {
  if (obj.somethingNotDefined) {
    Math.round(obj.something)
  }
}

suite('Cloning', () => {
  benchmark('protoClone', () => {
    use(protoClone(styles.modal))
  })

  benchmark('walkClone', () => {
    use(walkClone(styles.modal))
  })

  benchmark('Object.assign', () => {
    use(assign(styles.modal))
  })

  benchmark('jsonClone', () => {
    use(jsonClone(styles.modal))
  })
})
