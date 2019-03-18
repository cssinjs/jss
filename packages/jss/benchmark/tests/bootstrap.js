import {create, SheetsRegistry} from 'jss'
import global from 'jss-plugin-global'

import styles from '../fixtures/bootstrap.json'

// Avoid memory leak with registry.
const options = {Renderer: null}
const jssWithoutGlobal = create(options)
const jssWithGlobal = create(options).use(global())

suite('Bootstrap JSS to CSS', () => {
  benchmark('unnamed .toString()', () => {
    const styleSheet = jssWithGlobal.createStyleSheet({'@global': styles}, options)
    const sheetsRegistry = new SheetsRegistry()
    sheetsRegistry.add(styleSheet)

    sheetsRegistry.toString()
  })

  benchmark('named .toString()', () => {
    const styleSheet = jssWithoutGlobal.createStyleSheet(styles, options)
    const sheetsRegistry = new SheetsRegistry()
    sheetsRegistry.add(styleSheet)

    sheetsRegistry.toString()
  })
})
