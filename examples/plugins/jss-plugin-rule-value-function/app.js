import jss from 'jss'
import jssPluginRuleValueFunction from 'jss-plugin-rule-value-function'

const styles = {
  button: {
    color: data => data.color
  }
}

// JSS Setup
jss.use(jssPluginRuleValueFunction())
const sheet = jss.createStyleSheet(styles, {link: true}).attach()

sheet.update({color: 'red'})

// Application logic.
const div = document.body.appendChild(document.createElement('div'))
div.innerHTML = `<button class="${sheet.classes.button}">Button</button>`
