import {bench, describe} from 'vitest'
import {create} from 'jss'
import jssExpand from '../../src'
import styles from '../fixtures/bootstrap.json'

describe('Bootstrap unnamed JSS test', () => {
  bench('Pure JSS', () => {
    const jss = create({Renderer: null})
    jss.createStyleSheet(styles, {named: false}).toString()
  })

  bench('JSS + Plugin', () => {
    const jss = create({Renderer: null})
    jss.use(jssExpand())
    jss.createStyleSheet(styles, {named: false}).toString()
  })
})
