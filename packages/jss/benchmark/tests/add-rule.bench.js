import {bench, describe} from 'vitest'
import {create, sheets} from 'jss'
import styles from '../fixtures/regular.json'

describe('Add rule', () => {
  let sheet

  bench('.insertRule()', () => sheet.addRule('modal', styles.modal), {
    setup() {
      sheet = create().createStyleSheet().attach()
    },
    teardown() {
      sheet.detach()
      sheets.reset()
    }
  })
})
