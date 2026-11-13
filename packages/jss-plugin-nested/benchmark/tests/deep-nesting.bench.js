import {bench, describe} from 'vitest'
import {create} from 'jss'

import nested from '../../src/index'

describe('Deeply nested JSS', () => {
  bench('.createStyleSheet()', () => {
    const styles = {
      button: {
        color: 'black',
        '& .a, .b': {
          color: 'red',
          '& .c, &:hover': {
            color: 'gold'
          }
        }
      }
    }
    create({Renderer: null}).use(nested()).createStyleSheet(styles)
  })
})
