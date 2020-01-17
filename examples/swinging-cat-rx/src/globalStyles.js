import jss from './jss'
import * as theme from './theme'

const styles = {
  '@global': {
    body: {
      height: '100%',
      width: '100%',
      margin: 0,
      padding: 0,
      backgroundColor: theme.colorBg,
      overflow: 'hidden'
    },
    html: {
      height: '100%',
      width: '100%',
      margin: 0,
      padding: 0,
      backgroundColor: theme.colorBg,
      overflow: 'hidden'
    },
    '*': {
      boxSizing: 'border-box',
      position: 'relative',
      '&:before': {
        content: '""',
        display: 'block',
        boxSizing: 'border-box',
        position: 'relative'
      },
      '&:after': {
        content: '""',
        display: 'block',
        boxSizing: 'border-box',
        position: 'relative'
      }
    }
  }
}

jss.createStyleSheet(styles).attach()
