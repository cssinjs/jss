import {create} from 'jss'
import jssExpand from './../../src'
import styles from '../fixtures/bootstrap.json'

suite('Bootstrap unnamed JSS test', () => {
  benchmark('Pure JSS', () => {
    const jss = create()
    jss.createStyleSheet(styles, {named: false}).toString()
  })

  benchmark('JSS + Plugin', () => {
    const jss = create()
    jss.use(jssExpand())
    jss.createStyleSheet(styles, {named: false}).toString()
  })
})