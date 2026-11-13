import {bench, describe} from 'vitest'
import styles from '../fixtures/regular.json'

function Fn() {}

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

describe('Cloning', () => {
  bench('protoClone', () => {
    use(protoClone(styles.modal))
  })

  bench('walkClone', () => {
    use(walkClone(styles.modal))
  })

  bench('Object.assign', () => {
    use(assign(styles.modal))
  })

  bench('jsonClone', () => {
    use(jsonClone(styles.modal))
  })
})
