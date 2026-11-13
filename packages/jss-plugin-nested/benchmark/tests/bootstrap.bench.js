import {bench, describe} from 'vitest'
import {create} from 'jss'

import bootstrap from '../fixtures/modified-bootstrap.json'
import nested from '../../src/index'

describe('Nested bootstrap JSS to CSS', () => {
  bench('.toString()', () => {
    const jss = create({Renderer: null}).use(nested())

    jss.createStyleSheet(bootstrap).toString()
  })
})
