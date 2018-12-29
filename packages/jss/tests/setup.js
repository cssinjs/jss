import {sheets} from '../src'

global.process = {env: {NODE_ENV: 'development'}}

// Make sure tests are isolated.
afterEach(() => {
  sheets.reset()

  const styles = document.head.querySelectorAll('[data-jss]')
  for (let i = 0; i < styles.length; i++) {
    document.head.removeChild(styles[i])
  }
})
