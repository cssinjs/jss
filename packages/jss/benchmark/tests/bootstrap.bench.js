import {bench, describe} from 'vitest'
import {create} from 'jss'
import global from 'jss-plugin-global'

import styles from '../fixtures/bootstrap.json'

// Avoid memory leak with registry.
const options = {Renderer: null}
const jssWithoutGlobal = create(options)
const jssWithGlobal = create(options).use(global())

describe('Bootstrap JSS to CSS', () => {
  bench('unnamed .toString()', () => {
    jssWithGlobal.createStyleSheet({'@global': styles}, options).toString()
  })

  bench('named .toString()', () => {
    jssWithoutGlobal.createStyleSheet(styles, options).toString()
  })
})
