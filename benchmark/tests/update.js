import {create, sheets} from 'jss'

function teardown() {
  this.sheet.detach()
  this.sheets.reset()
}

function createSheet() {
  let colorSwitch = true
  return create()
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

suite('Update', () => {
  benchmark(
    'sheet.update()',
    function benchmark() {
      if (!this.sheet) {
        this.sheet = createSheet()
        this.sheets = sheets
      }

      this.sheet.update()
    },
    {teardown}
  )
})
