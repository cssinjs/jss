import {bench, describe} from 'vitest'
import {create} from 'jss'
import conditional from '../fixtures/conditional.json'
import regular from '../fixtures/regular.json'

// Avoid memory leak with registry.
const options = {Renderer: null}

describe('Conditional vs. regular rules to CSS', () => {
  bench('conditionals .toString()', () => {
    create(options).createStyleSheet(conditional).toString()
  })

  bench('regulars .toString()', () => {
    create(options).createStyleSheet(regular).toString()
  })
})
