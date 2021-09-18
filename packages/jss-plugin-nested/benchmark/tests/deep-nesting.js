import {create} from 'jss'

import nested from '../../src/index'

suite('Deeply nested JSS', () => {
  benchmark('.createStyleSheet()', () => {
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
    create().use(nested()).createStyleSheet(styles)
  })
})
