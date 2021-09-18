function setup() {
  this.style = document.createElement('style')
  this.style.type = 'text/css'
  document.head.appendChild(this.style)
  this.getCss = () => `
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
}

function teardown() {
  this.style.parentNode.removeChild(this.style)
  delete this.style
}

suite('Render rule', () => {
  benchmark(
    '.insertRule()',
    function benchmark() {
      const {sheet} = this.style
      sheet.insertRule(this.getCss(), sheet.cssRules.length)
    },
    {setup, teardown}
  )

  benchmark(
    '.createTextNode()',
    function benchmark() {
      this.style.appendChild(document.createTextNode(this.getCss()))
    },
    {setup, teardown}
  )
})
