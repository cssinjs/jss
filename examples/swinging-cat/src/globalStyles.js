import jss from './jss'
import * as theme from './theme'
import keyframes from './keyframes'

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
      animationTimingFunction: theme.easing,
      animationFillMode: 'both',
      '&:before': {
        content: '""',
        display: 'block',
        boxSizing: 'border-box',
        position: 'relative',
        animationTimingFunction: theme.easing,
        animationFillMode: 'both'
      },
      '&:after': {
        content: '""',
        display: 'block',
        boxSizing: 'border-box',
        position: 'relative',
        animationTimingFunction: theme.easing,
        animationFillMode: 'both'
      }
    }
  },
  '@keyframes bob': keyframes.bob,
  '@keyframes reverse-swing': keyframes.reverseSwing,
  '@keyframes face': keyframes.face,
  '@keyframes blink': keyframes.blink,
  '@keyframes swing-leg': keyframes.swingLeg,
  '@keyframes swing-tail': keyframes.swingTail,
  '@keyframes swing': keyframes.swing
}

const sheet = jss.createStyleSheet(styles).attach()
export default sheet
