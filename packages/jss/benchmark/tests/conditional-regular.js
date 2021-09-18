import {create} from 'jss'
import conditional from '../fixtures/conditional.json'
import regular from '../fixtures/regular.json'

// Avoid memory leak with registry.
const options = {Renderer: null}

suite('Conditional vs. regular rules to CSS', () => {
  benchmark('conditionals .toString()', () => {
    create(options).createStyleSheet(conditional).toString()
  })

  benchmark('regulars .toString()', () => {
    create(options).createStyleSheet(regular).toString()
  })
})
