import {create} from 'jss'
import styles from '../fixtures/conditional.json'

suite('Conditional Rules to CSS', () => {
  benchmark('.toString()', () => {
    create().createStyleSheet(styles).toString()
  })
})
