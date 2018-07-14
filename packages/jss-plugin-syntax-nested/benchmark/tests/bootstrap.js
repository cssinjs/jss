import {create} from 'jss'

import bootstrap from '../fixtures/modified-bootstrap.json'
import nested from '../../src/index'

suite('Nested bootstrap JSS to CSS', () => {
  benchmark('.toString()', () => {
    const jss = create().use(nested())

    jss.createStyleSheet(bootstrap).toString()
  })
})
