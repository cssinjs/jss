import jss from './jss'
import * as theme from './theme'
import face from './face'
import hand from './hand'
import ear from './ear'

const styles = {
  catUpper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transformOrigin: 'top center',
    zIndex: 1
  },
  catHead: {
    width: 90,
    height: 90,
    backgroundImage: `radial-gradient(
      circle at 10px 10px,
      #ffffff,
      #ffffff 40%,
      ${theme.colorFurLight} 65%,
      ${theme.colorFurDark}
    )`,
    borderRadius: '50%',
    top: 'calc(100% - 45px)'
  },
  catEars: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '50%',
    width: '100%',
    zIndex: -1
  }
}

const {classes} = jss.createStyleSheet(styles).attach()

export default () => `
  <div class=${classes.catUpper}>
    ${hand()}
    ${hand()}
    <div class=${classes.catHead}>
      <div class=${classes.catEars}>
        ${ear()}
        ${ear()}
      </div>
      ${face()}
    </div>
  </div>
`
