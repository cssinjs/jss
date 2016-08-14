import {create} from 'jss'
import styles from '../fixtures/regular.json'

function teardown() {
  this.sheet.detach()
  delete this.sheet
}

suite('Add rule', () => {
  benchmark('.insertRule()', function benchmark() {
    this.sheet = this.sheet || create().createStyleSheet().attach()
    this.sheet.addRule('modal', styles.modal)
  })
}, {teardown})
