import jss from 'jss'
import {Observable} from 'rxjs'
import jssPluginRuleValueObservable from 'jss-plugin-rule-value-observable'

const styles = {
  button: {
    color: new Observable(observer => {
      observer.next('red')
    })
  }
}

// JSS Setup
jss.use(jssPluginRuleValueObservable())
const {classes} = jss.createStyleSheet(styles, {link: true}).attach()

// Application logic.
const div = document.body.appendChild(document.createElement('div'))
div.innerHTML = `<button class="${classes.button}">Button</button>`
