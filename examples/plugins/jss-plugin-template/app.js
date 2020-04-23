import jss from 'jss'
import jssPluginTemplate from 'jss-plugin-template'

// Styles
const styles = {
  '@keyframes rotate': {
    from: `transform: rotateZ(0deg)`,
    to: `transform: rotateZ(360deg)`
  },
  button: `
    border-radius: 3px;
    background-color: green;
    color: red;
    margin: 20px 40px;
    padding: 10px;
    animation: $rotate 2s linear infinite;
  `,
  '@media print': {
    button: `color: black`
  }
}

// JSS Setup
jss.use(jssPluginTemplate())
const {classes} = jss.createStyleSheet(styles).attach()

// Application logic.
const div = document.body.appendChild(document.createElement('div'))
div.innerHTML = `<button class="${classes.button}">Button</button>`
