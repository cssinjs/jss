import {create} from 'jss'
import preset from 'jss-preset-default'

// Avoid memory leak with registry.
const options = {Renderer: null}

suite('create a new instance', () => {
  benchmark('without preset', () => {
    create(options)
  })

  benchmark('with preset', () => {
    create({
      ...options,
      ...preset()
    })
  })
})
