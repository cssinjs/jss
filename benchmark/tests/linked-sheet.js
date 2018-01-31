import jss, {sheets} from 'jss'

function teardown() {
  this.sheets.reset()
}

suite('Create linked sheet', () => {
  benchmark(
    'w/o linking',
    function benchmark() {
      this.sheets = sheets
      const sheet = jss.createStyleSheet()
      sheet.addRule('a0', {color: 'red'})
      sheet.addRule('a1', {color: 'red'})
      sheet.addRule('a2', {color: 'red'})
      sheet.addRule('a3', {color: 'red'})
      sheet.addRule('a4', {color: 'red'})
      sheet.attach().detach()
    },
    {teardown}
  )

  benchmark(
    'w linking, w/o escaping',
    function benchmark() {
      this.sheets = sheets
      const sheet = jss.createStyleSheet(null, {link: true})
      sheet.addRule('a0', {color: 'red'})
      sheet.addRule('a1', {color: 'red'})
      sheet.addRule('a2', {color: 'red'})
      sheet.addRule('a3', {color: 'red'})
      sheet.addRule('a4', {color: 'red'})
      sheet.attach().detach()
    },
    {teardown}
  )

  benchmark(
    'w linking, w escaping',
    function benchmark() {
      this.sheets = sheets
      const sheet = jss.createStyleSheet(null, {link: true})
      sheet.addRule('a0', {color: 'red'}, {selector: ':not(#\\20)'})
      sheet.addRule('a1', {color: 'red'}, {selector: ':not(#\\21)'})
      sheet.addRule('a2', {color: 'red'}, {selector: ':not(#\\22)'})
      sheet.addRule('a3', {color: 'red'}, {selector: ':not(#\\23)'})
      sheet.addRule('a4', {color: 'red'}, {selector: ':not(#\\24)'})
      sheet.attach().detach()
    },
    {teardown}
  )
})
