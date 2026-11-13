import {bench, describe} from 'vitest'

const getCss = () => `
  .container-${Math.random().toString().substr(2)} {
    position:fixed;
    top:0;
    right:0;
    bottom:0;
    left:0;
    z-index:1040;
    display:none;
    overflow:hidden;
    outline:0;
  }
`

describe('Render rule', () => {
  let style
  const options = {
    setup() {
      style = document.createElement('style')
      style.type = 'text/css'
      document.head.appendChild(style)
    },
    teardown() {
      style.remove()
    }
  }

  bench(
    '.insertRule()',
    () => {
      const {sheet} = style
      sheet.insertRule(getCss(), sheet.cssRules.length)
    },
    options
  )

  bench('.createTextNode()', () => style.appendChild(document.createTextNode(getCss())), options)
})
