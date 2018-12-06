import {create} from 'jss'
import preset from 'jss-preset-default'

// Avoid memory leak with registry.
const options = {virtual: true}

suite('create a new instance with and without preset', () => {
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
