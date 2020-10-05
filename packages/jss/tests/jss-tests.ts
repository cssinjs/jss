// API docs at http://cssinjs.org/js-api

import {
  create as createJSS,
  createGenerateId,
  JssStyle,
  SheetsRegistry,
  default as sharedInstance
} from 'jss'
import {NextChannel} from 'indefinite-observable'

const jss = createJSS().setup({createGenerateId})
jss.use({}, {}) // $ExpectType JSS

const styleSheet = jss.createStyleSheet<string>(
  {
    ruleWithMockObservable: {
      subscribe: (observer: {next: NextChannel<JssStyle | string | null | undefined>}) => {
        const next = typeof observer === 'function' ? observer : observer.next
        next({background: 'blue', display: 'flex'})

        // These tests are ported over from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/de655960b603d6b47f7030674f084780c76e045f/types/jss/jss-tests.ts
        // where there were $ExpectError cases; however, those don't seem to be
        // enforced in JSS's current testing harness.

        return {
          unsubscribe() {}
        }
      }
    },
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

attachedStyleSheet.classes.container // $ExpectType string
attachedStyleSheet.classes.ruleWithMockObservable // $ExpectType string

const rule = attachedStyleSheet.addRule('dynamicRule', {color: 'indigo'})
attachedStyleSheet.classes.dynamicRule // $ExpectType string

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

styleSheet2.classes.container // $ExpectType string
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

sheetsRegistry.index // $ExpectType number
sheetsRegistry.toString() // $ExpectType string
// With css options
sheetsRegistry.toString({indent: 5}) // $ExpectType string

sheetsRegistry.reset()
