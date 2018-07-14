import {create, sheets} from 'jss'
import styles from '../fixtures/regular.json'

const stylesStr = create()
  .createStyleSheet(styles)
  .toString()

function teardown() {
  this.sheets.reset()
}

suite('Raw rules vs. dynamic', () => {
  benchmark(
    'regular',
    function benchmark() {
      this.sheets = sheets
      this.sheet = create()
        .createStyleSheet(styles)
        .toString()
    },
    {teardown}
  )

  benchmark(
    'raw',
    function benchmark() {
      this.sheets = sheets
      this.sheet = create()
        .createStyleSheet({'@raw': stylesStr})
        .toString()
    },
    {teardown}
  )
})
