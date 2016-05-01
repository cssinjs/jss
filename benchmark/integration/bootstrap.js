import jss from 'jss'
import styles from '../fixtures/bootstrap.json'

suite('Bootstrap unnamed JSS to CSS', () => {
  benchmark('.toString()', () => {
    jss.createStyleSheet(styles, {named: false}).toString()
  })
})
