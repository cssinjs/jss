import jss from './jss'
import * as theme from './theme'
import leg from './leg'
import tail from './tail'
import sheet from './globalStyles'

const styles = {
  catLowerWrap: {
    height: '90%',
    position: 'absolute',
    top: '100%',
    width: 75,
    left: 'calc(50% - 37.5px)',
    animation: `${sheet.keyframes['reverse-swing']} ${theme.duration} 0.2s infinite both`,
    transformOrigin: 'top center'
  },
  catLower: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    animation: `${sheet.keyframes.swing} ${theme.duration} ${theme.offset} infinite both`,
    transformOrigin: 'top center',
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: 100,
      backgroundImage: `radial-gradient(circle at 10px 50px, #ffffff, #ffffff 40%, ${theme.colorFurLight} 65%, ${theme.colorFurDark})`,
      zIndex: 1
    }
  }
}

const {classes} = jss.createStyleSheet(styles).attach()

export default () => `
  <div class=${classes.catLowerWrap}>
    <div class=${classes.catLower}>
      ${leg(true)}
      ${leg(false)}
      ${tail()}
    </div>
  </div>
`
