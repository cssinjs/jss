import {bench, describe} from 'vitest'
import jss, {sheets} from 'jss'

describe('Create linked sheet', () => {
  const cases = [
    {name: 'w/o linking', link: false, escape: false},
    {name: 'w linking, w/o escaping', link: true, escape: false},
    {name: 'w linking, w escaping', link: true, escape: true}
  ]

  for (const {name, link, escape} of cases) {
    bench(
      name,
      () => {
        const sheet = jss.createStyleSheet(null, {link})
        for (let i = 0; i < 5; i++) {
          sheet.addRule(`a${i}`, {color: 'red'}, escape ? {selector: `:not(#\\2${i})`} : {})
        }
        sheet.attach().detach()
      },
      {
        teardown() {
          sheets.reset()
        }
      }
    )
  }
})
