import {bench, describe} from 'vitest'
import {create, sheets} from 'jss'
import ruleValueFunction from 'jss-plugin-rule-value-function'

function createSheet() {
  let colorSwitch = true
  return create()
    .use(ruleValueFunction())
    .createStyleSheet(
      {
        button: {
          color: () => {
            // Need to change color each time to avoid caching.
            colorSwitch = !colorSwitch
            return colorSwitch ? 'green' : 'red'
          }
        }
      },
      {link: true}
    )
    .attach()
}

describe('Update', () => {
  let sheet

  bench('sheet.update()', () => sheet.update(), {
    setup() {
      sheet = createSheet()
    },
    teardown() {
      sheet.detach()
      sheets.reset()
    }
  })
})
