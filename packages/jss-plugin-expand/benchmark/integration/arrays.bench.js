import {bench, describe} from 'vitest'
import {create} from 'jss'
import jssExpand from '../../src'
import arraysWithoutPlugin from '../fixtures/arrays-without-plugin.json'
import arraysWithPlugin from '../fixtures/arrays-with-plugin.json'

describe('Array with DIFFERENT sheets', () => {
  bench('Pure JSS', () => {
    const jss = create({Renderer: null})
    jss.createStyleSheet(arraysWithoutPlugin).toString()
  })

  bench('JSS + Plugin', () => {
    const jss = create({Renderer: null})
    jss.use(jssExpand())
    jss.createStyleSheet(arraysWithPlugin).toString()
  })
})

describe('Array with SAME sheets', () => {
  bench('Pure JSS', () => {
    const jss = create({Renderer: null})
    jss.createStyleSheet(arraysWithoutPlugin).toString()
  })

  bench('JSS + Plugin', () => {
    const jss = create({Renderer: null})
    jss.use(jssExpand())
    jss.createStyleSheet(arraysWithoutPlugin).toString()
  })
})
