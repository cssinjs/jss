import jss from 'jss'

// Styles
const styles = {
  box: {
    float: 'left',
    width: '50px',
    height: '50px',
    background: 'red',
    margin: '10px'
  }
}

// Application logic.
const sheet = jss
  .createStyleSheet(styles, {
    link: true
  })
  .attach()

const section = document.querySelectorAll('section')[0]
for (let i = 0; i < 100; i++) {
  const box = document.createElement('div')
  box.className = sheet.classes.box
  section.appendChild(box)
}

function setColor(e) {
  sheet.getRule('box').prop('background', e.target.innerHTML)
}

const toArray = Array.prototype.slice
const buttons = toArray.call(document.querySelectorAll('button'))
buttons.forEach(button => {
  button.addEventListener('click', setColor)
})
