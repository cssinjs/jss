import styles from '../fixtures/regular.json'

const fn = () => null

function protoClone(style) {
  fn.prototype = style
  return new fn
}

function walkClone(style) {
  const newStyle = {}
  for (const name in style) {
    newStyle[name] = style[name]
  }
  return newStyle
}

function use(obj) {
  if (obj.somethingNotDefined) {
    console.log(123456)
  }
}

suite('Cloning', () => {
  benchmark('protoClone', function benchmark() {
    use(protoClone(styles.modal))
  })

  benchmark('walkClone', function benchmark() {
    use(walkClone(styles.modal))
  })

  benchmark('Object.assign', function benchmark() {
    use(Object.assign({}, styles.modal))
  })
})
