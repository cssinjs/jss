import {create} from 'jss'
import styles from '../fixtures/bootstrap.json'

suite('Bootstrap unnamed JSS to CSS', () => {
  benchmark('.toString()', () => {
    create().createStyleSheet(styles, {named: false}).toString()
  })
})
