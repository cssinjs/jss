import {create} from 'jss'
import styles from '../fixtures/regular.json'

suite('Batch mode vs. single', () => {
  benchmark('.textContent', () => {
    create()
      .createStyleSheet(styles)
      .attach()
      .detach()
  })

  benchmark('.addRules() in attached sheet', () => {
    const sheet = create()
      .createStyleSheet()
      .attach()
    sheet.addRules(styles)
    sheet.detach()
  })

  benchmark('.addRules() in detached sheet', () => {
    const sheet = create().createStyleSheet()
    sheet.addRules(styles)
    sheet.attach().detach()
  })
})
