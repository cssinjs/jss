import {create} from 'jss'
import jssExpand from './../../src'
import arraysWithoutPlugin from '../fixtures/arrays-without-plugin.json'
import arraysWithPlugin from '../fixtures/arrays-with-plugin.json'

suite('Array with DIFFERENT sheets', () => {
  benchmark('Pure JSS', () => {
    const jss = create()
    jss.createStyleSheet(arraysWithoutPlugin).toString()
  })

  benchmark('JSS + Plugin', () => {
    const jss = create()
    jss.use(jssExpand())
    jss.createStyleSheet(arraysWithPlugin).toString()
  })
})

suite('Array with SAME sheets', () => {
  benchmark('Pure JSS', () => {
    const jss = create()
    jss.createStyleSheet(arraysWithoutPlugin).toString()
  })

  benchmark('JSS + Plugin', () => {
    const jss = create()
    jss.use(jssExpand())
    jss.createStyleSheet(arraysWithoutPlugin).toString()
  })
})