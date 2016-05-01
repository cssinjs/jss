import jss from 'jss'
import styles from '../fixtures/conditional.json'

suite('Conditional Rules to CSS', () => {
  benchmark('.toString()', () => {
    jss.createStyleSheet(styles).toString()
  })
})
