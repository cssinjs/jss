import {create} from 'jss'
import global from 'jss-global'

import styles from '../fixtures/bootstrap.json'

const globalPlugin = global()

const jss = create().use(globalPlugin)

suite('Bootstrap JSS to CSS', () => {
  benchmark('unnamed .toString()', () => {
    jss
      .createStyleSheet({'@global': styles})
      .toString()
  })

  benchmark('named .toString()', () => {
    jss
      .createStyleSheet(styles)
      .toString()
  })
})
