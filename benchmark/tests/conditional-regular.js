import {create} from 'jss'
import conditional from '../fixtures/conditional.json'
import regular from '../fixtures/regular.json'

suite('Conditional vs. regular rules to CSS', () => {
  benchmark('conditionals .toString()', () => {
    create()
      .createStyleSheet(conditional)
      .toString()
  })

  benchmark('regulars .toString()', () => {
    create()
      .createStyleSheet(regular)
      .toString()
  })
})
