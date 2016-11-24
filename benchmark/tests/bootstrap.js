import {create} from 'jss'
import global from 'jss-global'

import styles from '../fixtures/bootstrap.json'

const jssWithoutGlobal = create()
const jssWithGlobal = create().use(global())

suite('Bootstrap JSS to CSS', () => {
  benchmark('unnamed .toString()', () => {
    jssWithGlobal
      .createStyleSheet({'@global': styles})
      .toString()
  })

  benchmark('named .toString()', () => {
    jssWithoutGlobal
      .createStyleSheet(styles)
      .toString()
  })
})
