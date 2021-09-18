import {create, sheets} from 'jss'
import styles from '../fixtures/regular.json'

function teardown() {
  this.sheet.detach()
  this.sheets.reset()
  delete this.sheet
}

suite('Add rule', () => {
  benchmark(
    '.insertRule()',
    function benchmark() {
      this.sheets = sheets
      this.sheet = this.sheet || create().createStyleSheet().attach()
      this.sheet.addRule('modal', styles.modal)
    },
    {teardown}
  )
})
