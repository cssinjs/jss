import jss from 'jss'

// Styles
const styles = {
  button1: {
    padding: '20px',
    background: 'blue'
  }
}

const div = document.body.appendChild(document.createElement('div'))

// Application logic.
div.innerHTML = '<button>Button 1</button> <button>Button 2</button>'

const buttons = document.querySelectorAll('button')

// Apply from stylesheet rule.
const sheet = jss.createStyleSheet(styles)
sheet.getRule('button1').applyTo(buttons[0])

// Apply a standalone rule.
const button2 = jss.createRule({
  padding: '20px',
  background: 'green'
})
button2.applyTo(buttons[1])
