import {create} from 'jss'
import conditional from '../fixtures/conditional.json'
import regular from '../fixtures/regular.json'

// Avoid memory leak with registry.
const options = {virtual: true}

suite('Conditional vs. regular rules to CSS', () => {
  benchmark('conditionals .toString()', () => {
    create()
      .createStyleSheet(conditional, options)
      .toString()
  })

  benchmark('regulars .toString()', () => {
    create()
      .createStyleSheet(regular, options)
      .toString()
  })
})
