import {create} from 'jss'
import styles from '../fixtures/bootstrap.json'

suite('Bootstrap JSS to CSS', () => {
  benchmark('unnamed .toString()', () => {
    create()
      .createStyleSheet(styles, {named: false})
      .toString()
  })

  benchmark('named .toString()', () => {
    create()
      .createStyleSheet(styles)
      .toString()
  })
})
