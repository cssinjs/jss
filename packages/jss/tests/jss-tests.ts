// API docs at http://cssinjs.org/js-api

import {
  create as createJSS,
  createGenerateId,
  JssStyle,
  SheetsRegistry,
  default as sharedInstance,
  MinimalObservable
} from 'jss'

const jss = createJSS().setup({createGenerateId})
jss.use({}, {})

const styleSheet = jss.createStyleSheet<string>(
  {
    ruleWithMockObservable: {
      subscribe: (observer) => {
        const next = typeof observer === 'function' ? observer : observer.next
        next({background: 'blue', display: 'flex'})

        return {
          unsubscribe() {}
        }
      }
    } as MinimalObservable<JssStyle | string | null | undefined>,
    rule: {
      color: (data: {color: string}) => data.color,

      '&:hover': {
        color: 'blue'
      }
    },
    container: {
      display: 'flex',
      'align-items': 'center',
      width: 100,
      opacity: 0.5
    }
  },
  {
    link: true
  }
)

const attachedStyleSheet = styleSheet.attach()

attachedStyleSheet.classes.container
attachedStyleSheet.classes.ruleWithMockObservable

const rule = attachedStyleSheet.addRule('dynamicRule', {color: 'indigo'})
attachedStyleSheet.classes.dynamicRule

attachedStyleSheet.deleteRule('dynamicRule')

// test that `addRule` supports the shorthand signature
const dynamicRule = attachedStyleSheet.addRule({color: 'red'})

const div = document.createElement('div')

const containerRule = attachedStyleSheet.getRule('container')
const css = attachedStyleSheet.toString()

attachedStyleSheet.addRules({
  rule1: {
    fontFamily: 'Roboto',
    color: '#FFFFFF'
  },
  rule2: {
    fontFamily: 'Inconsolata',
    fontSize: 17
  }
})

const styleSheet2 = sharedInstance.createStyleSheet({
  container: {
    background: '#000099'
  },
  ruleWithMockObservable: {
    subscribe() {
      return {
        unsubscribe() {}
      }
    }
  }
})

styleSheet2.classes.container
// @ts-ignore
styleSheet2.classes.notAValidKey

/* SheetsRegistry test */
const sheetsRegistry = new SheetsRegistry()
sheetsRegistry.add(styleSheet)

const secondStyleSheet = jss.createStyleSheet(
  {
    container2: {
      display: 'flex',
      width: 150,
      opacity: 0.8
    }
  },
  {
    link: true
  }
)

sheetsRegistry.add(secondStyleSheet)
sheetsRegistry.remove(secondStyleSheet)

sheetsRegistry.index
sheetsRegistry.toString()
// With css options
sheetsRegistry.toString({indent: 5})

sheetsRegistry.reset()
