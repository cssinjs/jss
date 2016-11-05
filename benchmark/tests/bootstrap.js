import {create} from 'jss'
import global from 'jss-global'

import styles from '../fixtures/bootstrap.json'

const globalPlugin = global()

suite('Bootstrap JSS to CSS', () => {
  benchmark('unnamed .toString()', () => {
    create()
      .use(globalPlugin)
      .createStyleSheet({'@global': styles})
      .toString()
  })

  benchmark('named .toString()', () => {
    create()
      .use(globalPlugin)
      .createStyleSheet(styles)
      .toString()
  })
})
