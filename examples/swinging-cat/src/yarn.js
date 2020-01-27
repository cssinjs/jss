import jss from './jss'
import * as theme from './theme'

const styles = {
  yarn: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundImage: `radial-gradient(circle at top left, #e97c7f, ${theme.colorYarn} 50%, #af1d22)`,
    zIndex: 1,
    '&:before': {
      content: '""',
      left: 'calc(50% + 7px)',
      position: 'absolute',
      width: 20,
      height: 20,
      borderRadius: '50%',
      backgroundColor: '#fff',
      top: -1
    },
    '&:after': {
      content: '""',
      right: 'calc(50% + 7px)',
      position: 'absolute',
      width: 20,
      height: 20,
      borderRadius: '50%',
      backgroundColor: '#fff',
      top: -1
    }
  }
}

const {classes} = jss.createStyleSheet(styles).attach()

export default () => `<div class=${classes.yarn}></div>`
