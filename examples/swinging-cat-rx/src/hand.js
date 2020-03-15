import jss from './jss'
import * as theme from './theme'

const styles = {
  catHand: {
    position: 'absolute',
    width: 20,
    height: '100%',
    backgroundColor: '#fff',
    zIndex: -1,
    backgroundImage: `linear-gradient(
      to right,
      ${theme.colorFurLight},
      ${theme.colorFurLight} 20%,
      ${theme.colorFurDark}
    )`,
    '&:nth-child(1)': {
      borderTopLeftRadius: 100,
      left: 10,
      '&:after': {
        content: '""',
        left: '50%'
      }
    },
    '&:nth-child(2)': {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 100,
      right: 10,
      '&:after': {
        content: '""',
        right: '50%'
      }
    }
  }
}

const {classes} = jss.createStyleSheet(styles).attach()

export default () => `<div class=${classes.catHand}></div>`
