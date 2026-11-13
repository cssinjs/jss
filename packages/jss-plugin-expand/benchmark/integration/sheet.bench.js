import {bench, describe} from 'vitest'
import {create} from 'jss'
import jssExpand from '../../src'
import stylesWithoutPlugin from '../fixtures/sheet-without-plugin.json'
import stylesWithPlugin from '../fixtures/sheet-with-plugin.json'

describe('General test with DIFFERENT sheets', () => {
  bench('Pure JSS', () => {
    const jss = create({Renderer: null})
    jss.createStyleSheet(stylesWithoutPlugin).toString()
  })

  bench('JSS + Plugin', () => {
    const jss = create({Renderer: null})
    jss.use(jssExpand())
    jss.createStyleSheet(stylesWithPlugin).toString()
  })
})

describe('General test with SAME sheet)', () => {
  bench('Pure JSS', () => {
    const jss = create({Renderer: null})
    jss.createStyleSheet(stylesWithoutPlugin).toString()
  })

  bench('JSS + Plugin', () => {
    const jss = create({Renderer: null})
    jss.use(jssExpand())
    jss.createStyleSheet(stylesWithoutPlugin).toString()
  })
})
