import {create} from 'jss'
import global from 'jss-global'

import styles from '../fixtures/bootstrap.json'

// Avoid memory leak with registry.
const options = {virtual: true}
const jssWithoutGlobal = create(options)
const jssWithGlobal = create(options).use(global())

suite('Bootstrap JSS to CSS', () => {
  benchmark('unnamed .toString()', () => {
    jssWithGlobal.createStyleSheet({'@global': styles}, options).toString()
  })

  benchmark('named .toString()', () => {
    jssWithoutGlobal.createStyleSheet(styles, options).toString()
  })
})
