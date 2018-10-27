import {create} from 'jss'
import global from 'jss-plugin-syntax-global'
import murmurhash from 'murmurhash'
import styles from '../fixtures/bootstrap.json'

// Avoid memory leak with registry.
const options = {
  virtual: true,
  createGenerateId: () => {
    const fn = rule => {
      return (
        rule.key +
        Math.random()
          .toString()
          .substr(2, 6)
      )
    }
    fn.counter = 0
    return fn
  }
}

const jss = create(options)
const jssWithGlobal = create(options).use(global())
const options2 = {
  virtual: true,
  createGenerateId: () => rule => {
    return rule.key + murmurhash.v2(rule.toString())
  }
}
const jssWithHashV2 = create(options2)
const options3 = {
  virtual: true,
  createGenerateId: () => rule => rule.key + murmurhash.v3(rule.toString())
}
const jssWithHashV3 = create(options3)

const logStyles = {a: {color: 'red'}}

console.log('scoped .toString()', jss.createStyleSheet(logStyles).toString())

console.log(
  'scoped with murmurhash2 .toString()',
  jssWithHashV2.createStyleSheet(logStyles).toString()
)

console.log(
  'scoped with murmurhash3 .toString()',
  jssWithHashV3.createStyleSheet(logStyles).toString()
)

console.log('global .toString()', jssWithGlobal.createStyleSheet({'@global': logStyles}).toString())

suite.only('Bootstrap JSS to CSS', () => {
  benchmark('scoped .toString()', () => {
    jss.createStyleSheet(styles, options).toString()
  })

  benchmark('scoped with murmurhash2 .toString()', () => {
    jssWithHashV2.createStyleSheet(styles, options2).toString()
  })

  benchmark('scoped with murmurhash3 .toString()', () => {
    jssWithHashV3.createStyleSheet(styles, options3).toString()
  })

  benchmark('global .toString()', () => {
    jssWithGlobal.createStyleSheet({'@global': styles}, options).toString()
  })
})
