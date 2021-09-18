import {create, sheets} from 'jss'
import styles from '../fixtures/regular.json'

function teardown() {
  this.sheets.reset()
}

suite('Batch mode vs. single', () => {
  benchmark(
    '.textContent',
    function benchmark() {
      this.sheets = sheets
      create().createStyleSheet(styles).attach().detach()
    },
    {teardown}
  )
})
