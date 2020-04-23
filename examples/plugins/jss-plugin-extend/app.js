import jss from 'jss'
import jssPluginExtend from 'jss-plugin-extend'

const button0 = {
  padding: '20px',
  background: 'blue'
}

const redButton = {
  background: 'red'
}

const styles = {
  button0,
  button1: {
    extend: [button0, redButton],
    'font-size': '20px'
  }
}

// JSS Setup
jss.use(jssPluginExtend())
const {classes} = jss.createStyleSheet(styles).attach()

// Application logic.
const div = document.body.appendChild(document.createElement('div'))
div.innerHTML = `\
  <button class="${classes.button0}">Button 1</button>\
  <button class="${classes.button1}">Button 2</button>\
`
