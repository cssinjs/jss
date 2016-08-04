import {create} from 'jss'
import styles from '../fixtures/regular.json'

suite('Regular Rules to CSS', () => {
  benchmark('.toString()', () => {
    create().createStyleSheet(styles).toString()
  })
})
