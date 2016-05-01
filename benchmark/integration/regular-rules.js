import jss from 'jss'
import styles from '../fixtures/regular.json'

suite('Regular Rules to CSS', () => {
  benchmark('.toString()', () => {
    jss.createStyleSheet(styles).toString()
  })
})
