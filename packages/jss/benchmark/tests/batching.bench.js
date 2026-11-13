import {bench, describe} from 'vitest'
import {create, sheets} from 'jss'
import styles from '../fixtures/regular.json'

describe('Batch mode vs. single', () => {
  bench('.textContent', () => create().createStyleSheet(styles).attach().detach(), {
    teardown() {
      sheets.reset()
    }
  })
})
