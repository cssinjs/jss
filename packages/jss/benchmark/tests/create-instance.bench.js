import {bench, describe} from 'vitest'
import {create} from 'jss'
import preset from 'jss-preset-default'

// Avoid memory leak with registry.
const options = {Renderer: null}

describe('create a new instance', () => {
  bench('without preset', () => {
    create(options)
  })

  bench('with preset', () => {
    create({
      ...options,
      ...preset()
    })
  })
})
